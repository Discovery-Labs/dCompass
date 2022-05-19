// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassPathwayNFT
 * @dev NFTs for creating pathways
 */

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./RandomNumberConsumer.sol";
import "./Verify.sol";

contract PathwayNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;

    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract; //VRF Contract used for randomness
    Verify verifyContract; //Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    address appDiamond;//address needed for checking valid erc20Addrs per chain
    address adventureFactory;//address of the adventure factory
    mapping(uint256 => string) public statusStrings;
    mapping(string => bool) public pathwayMinted; // tracks if mint has been done
    mapping(string => address[]) internal contributors; //contributors to this pathway
    mapping (string => address) public creator;//creator for this pathwayId
    uint8[] internal rarityThresholds; //used for getting cutoffs of common, uncommon et al
    mapping(string => string) public projectIdforPathway; //the projectId that is the root
    mapping(string => PathwayStatus) public status;
    mapping(string => uint256) public votes; //tally of approved votes per pathwayId;
    mapping (string => uint) public votesReject;//tally of rejection votes per pathwayId;
    mapping(string => mapping(address => bool)) public reviewerVotes; //vote record of approved voters for PathwayId
    mapping (string => uint) public nativeRewards;//pathway rewards in native token
    mapping (string => mapping(address => uint)) internal erc20Amounts;//pathway reward Amts in other tokens
    mapping (string => bool) public nativeRefundClaimed;//pathway refund claimed
    mapping (string => mapping(address => bool)) erc20RefundClaimed;//pathway erc20 refund claimed
    mapping (string => uint) public numUsersRewardPerPathway;//number of users rewarded per pathway
    mapping (string => uint) public currentNumUsersRewardPerPathwayNative;//current number of users already claimed native reward per pathway
    mapping (string => mapping ( address => uint)) public currentNumUsersRewardPerPathwayERC20;// currentnumber of users already claimed reward per pathway per ERC20 Address
    mapping (string => mapping(address => uint)) public nonces;//nonce for certain verify functions per address per projectId
    mapping (string => address) public adventurerAddress;//address of adventurer NFT per pathway Id

    //local adventure mappings
    //_pathwayID => version => minterAddress => boolean
    mapping (string => mapping(uint => mapping(address => bool))) internal mintTrackerByPathwayIdVersionMinter;
    //_pathwayID => version => addresses of all minters...only used for getter when necessary
    mapping (string => mapping(uint => address[])) internal allMintersPerPathwayAndVersion;
    //_pathwayID => version => tokenIds of all minters...only used for getter when necessary
    mapping (string => mapping(uint => uint[])) internal allTokenIdsPerPathwayAndVersion;
    mapping (uint => TokenInfo) internal tokenInfoById;//will be used by getter

    //pathwayId => ERC20Address => senderAddress => bool
    mapping (string => mapping(address => mapping (address => bool))) userRewardedForPathwayERC20;//has user received funds for this pathway in ERC20Token Address
    mapping (string => mapping(address => bool)) public userRewardedForPathwayNative;//has user received funds for this pathway in native token
    uint256 public fee = 1300; //number divided by 10000 for fee. for example 100 = 1%
    uint256 public creatorFee = 200; //number divided by 10000 for fee. for example 100 = 1%

    enum PathwayStatus {
        NONEXISTENT,
        PENDING,
        DENIED,
        APPROVED
    }

    struct TokenInfo{
        string pathwayId;
        uint version;
    }

    event ReceiveCalled(address _caller, uint256 _value);
    event PathwayApproved(string indexed _pathwayId);
    event NFTPathwayMinted(
        address indexed _to,
        string indexed _tokenURI,
        string indexed _badgeId
    );

    constructor(
        address _vrfAddress,
        address _projectNFTAddress,
        address _verifyAddress
    ) ERC721("dCompassPath", "DCOMPPATH") {
        vrfContract = RandomNumberConsumer(_vrfAddress);
        verifyContract = Verify(_verifyAddress);
        //uint rarityTotal = 0;
        /*for (uint8 i =0; i<_initRarities.length; i++){
            rarityTotal += _initRarities[i];
        }
        require(rarityTotal == 100, "rarities do not add to 100");
        rarityThresholds = _initRarities;*/
        projectNFTAddress = _projectNFTAddress;
        statusStrings[0] = "NONEXISTENT";
        statusStrings[1] = "PENDING";
        statusStrings[2] = "DENIED";
        statusStrings[3] = "APPROVED";
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }

    function createPathwayAndVote(
        address[] memory _contributors,
        string memory _pathwayId,
        string memory _projectId,
        bytes32[2] memory r,
        bytes32[2] memory s,
        uint8[2] memory v,
        uint256 votesNeeded,
        uint numUsersRewarded,
        bool[2] memory rewardsNative,
        address _ERC20Address,
        uint amount,
        address sender) external {
            createPathway(_pathwayId, _projectId, numUsersRewarded, rewardsNative[0], _ERC20Address, rewardsNative[1], amount, sender);
            voteForApproval(_contributors, _pathwayId, _projectId, r, s, v, votesNeeded);
        }

    function createPathway(
        string memory _pathwayId,
        string memory _projectId,
        uint numUsersRewarded,
        bool callRewards,
        address _ERC20Address,
        bool useNative,
        uint amount,
        address sender
    ) public payable {
            require(status[_pathwayId] == PathwayStatus.NONEXISTENT);
            status[_pathwayId] = PathwayStatus.PENDING;
            projectIdforPathway[_pathwayId] = _projectId;
            numUsersRewardPerPathway[_pathwayId] = numUsersRewarded;
            creator[_pathwayId] = sender;
            if (callRewards){
                addPathwayCreationReward(_pathwayId, _ERC20Address, useNative, amount);
            }
    }

    function voteForApproval(
        address[] memory _contributors,
        string memory _pathwayId,
        string memory _projectId,
        bytes32[2] memory r,
        bytes32[2] memory s,
        uint8[2] memory v,
        uint256 votesNeeded
    ) public {
        require(
            status[_pathwayId] == PathwayStatus.PENDING,
            "status not pending"
        );
        require(
            !reviewerVotes[_pathwayId][_msgSender()],
            "already voted for this pathway"
        );
        require(
            keccak256(abi.encodePacked(projectIdforPathway[_pathwayId])) == keccak256(abi.encodePacked(_projectId)),
            "incorrect projectId"
        );
        (bool voteAllowed, bool thresholdCheck) = verifyContractCall(_pathwayId,_projectId,r,s,v, votesNeeded, false);
        votes[_pathwayId]++;
        reviewerVotes[_pathwayId][_msgSender()] = true;
        if (votes[_pathwayId] == 1) {
            require(_contributors.length > 0, "empty array");
            contributors[_pathwayId] = _contributors;
            if (votesNeeded <= votes[_pathwayId]) {
                status[_pathwayId] = PathwayStatus.APPROVED;
                emit PathwayApproved(_pathwayId);
                //vrfContract.getRandomNumber(_pathwayId, contributors[_pathwayId].length);
            }
        } else {
            if (votes[_pathwayId] >= votesNeeded) {
                status[_pathwayId] = PathwayStatus.APPROVED;
                emit PathwayApproved(_pathwayId);
                //vrfContract.getRandomNumber(_pathwayId, contributors[_pathwayId].length);
            }
        }
    }

    function voteForRejection(string memory _pathwayId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint256 votesNeeded) public {
        require(status[_pathwayId] == PathwayStatus.PENDING, "pathway not pending");
        require(!reviewerVotes[_pathwayId][_msgSender()], "already voted for this pathway");
        require(
            keccak256(abi.encodePacked(projectIdforPathway[_pathwayId])) == keccak256(abi.encodePacked(_projectId)),
            "incorrect projectId"
        );
        (bool voteAllowed, bool thresholdCheck) = verifyContractCall(_pathwayId,_projectId,r,s,v, votesNeeded, false);
        votesReject[_pathwayId]++;
        reviewerVotes[_pathwayId][_msgSender()] = true;        
        if(votesReject[_pathwayId] >= votesNeeded){
            status[_pathwayId] = PathwayStatus.DENIED;
            /*(bool success,) = appWallet.call{value : stakePerProject[_projectId]}("");
            require(success, "transfer failed");*/
        }
    }

    //TODO: move these to rewards contract!
    function addPathwayCreationReward(string memory _pathwayId, address _ERC20Address, bool useNative, uint amount) public payable{
        require (status[_pathwayId] == PathwayStatus.PENDING || status[_pathwayId] == PathwayStatus.APPROVED, "pathway not pending/approved");
        require (numUsersRewardPerPathway[_pathwayId] > 0, "no user rewards");
        (bool success , bytes memory data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("appWallet()"))));
        require(success);
        address appWallet = abi.decode(data, (address));
        uint appPortion = (amount*fee)/10000;
        uint creatorPortion = (amount*creatorFee)/10000;
        if(useNative){
            require(msg.value >= amount + appPortion + creatorPortion, "insufficient funds");
            (success,) = payable(appWallet).call{value : appPortion}("");
            require(success);
            (success,) = payable(creator[_pathwayId]).call{value : creatorPortion}("");
            require(success);
            nativeRewards[_pathwayId] += amount;
            if(msg.value > amount + appPortion){
                (success,) = payable(_msgSender()).call{value : msg.value - amount- appPortion}("");
                require(success);
            }
        }
        else{
            require(_ERC20Address != address(0));
            (success, data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("checkApprovedERC20PerProjectByChain(string,uint256,address)")), projectIdforPathway[_pathwayId],block.chainid, _ERC20Address));
            require(success);
            success = abi.decode(data, (bool));
            require(success, "ERC20 not approved");
            IERC20(_ERC20Address).transferFrom(_msgSender(), appWallet, appPortion);
            IERC20(_ERC20Address).transferFrom(_msgSender(), address(this), amount + creatorPortion);
            IERC20(_ERC20Address).transfer(creator[_pathwayId], creatorPortion);
            erc20Amounts[_pathwayId][_ERC20Address] += amount;
        }
    }

    function setNumberOfUsersRewarded(string memory _pathwayId, uint256 newNumber, bytes32 r, bytes32 s, uint8 v) external {
        require(newNumber > numUsersRewardPerPathway[_pathwayId] - 1, "PathwayNFT : invalid number");
        _verify(_msgSender(), _pathwayId, newNumber, r, s, v);
        numUsersRewardPerPathway[_pathwayId] = newNumber;
    }

    function claimRejectionRefund(string memory _pathwayId, bool native, address _ERC20Address) external {
        require(status[_pathwayId] == PathwayStatus.DENIED, "incorrect pathway status");
        string memory _projectId = projectIdforPathway[_pathwayId];
        (bool success, bytes memory data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectWallets(string)")), _projectId));
        require(success);
        address refundWallet = abi.decode(data, (address));
        require(refundWallet != address(0));
        if(native){
            require(!nativeRefundClaimed[_pathwayId], "native reward already claimed");
            (success,) = payable(refundWallet).call{value : nativeRewards[_pathwayId]}("");
            require(success);
            nativeRefundClaimed[_pathwayId] = true;
        }
        else{
            require(!erc20RefundClaimed[_pathwayId][_ERC20Address], "erc20 reward already claimed");
            IERC20(_ERC20Address).transfer(refundWallet, erc20Amounts[_pathwayId][_ERC20Address]);
            erc20RefundClaimed[_pathwayId][_ERC20Address] = true;
        }
    }

    function createToken(
        string memory _tokenURI,
        string memory _pathwayId,
        string memory _projectId,
        bytes32[2] memory r,
        bytes32[2] memory s,
        uint8[2] memory v,
        uint256 votesNeeded
    ) public returns (uint256[] memory) {
        require(!pathwayMinted[_pathwayId], "already minted");
        (bool allowed,) = verifyContractCall(_pathwayId,_projectId,r,s,v, votesNeeded, true);
        if (status[_pathwayId] == PathwayStatus.PENDING) {
            require(votesNeeded <= votes[_pathwayId], "not enough votes");
            status[_pathwayId] = PathwayStatus.APPROVED;
        }
        require(
            status[_pathwayId] == PathwayStatus.APPROVED,
            "can only mint for pathways in approved status"
        );

        //TODO : this can later be made a require instead of if statement?
        bytes memory data;

        (allowed, data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("projectDiamondAddrs(string)")), _projectId));
        require(allowed);
        address projectDiamond = abi.decode(data, (address));
        if(projectDiamond != address(0)){
            (allowed, data) = projectDiamond.call(abi.encodeWithSelector(bytes4(keccak256("addPathwayId(string)")), _pathwayId));
            require(allowed);
        }

        //batch minting
        uint256[] memory newItems = new uint256[](
            contributors[_pathwayId].length
        );
        uint256 newItemId;

        for (uint256 i = 0; i < contributors[_pathwayId].length; i++) {
            _tokenIds.increment();
            newItemId = _tokenIds.current();

            _mint(contributors[_pathwayId][i], newItemId);
            _setTokenURI(newItemId, _tokenURI);

            emit NFTPathwayMinted(
                contributors[_pathwayId][i],
                _tokenURI,
                _pathwayId
            );
        }
        pathwayMinted[_pathwayId] = true;
        return newItems;
    }

    function claimPathwayRewards(string memory _pathwayId, bool native, address _ERC20Address, bytes32 r, bytes32 s, uint8 v, bool claimReward, string memory _tokenURI, uint256 version) external {
        uint amount;
        if(claimReward){
            if(native){
                require(!userRewardedForPathwayNative[_pathwayId][_msgSender()]);
                require(currentNumUsersRewardPerPathwayNative[_pathwayId] < numUsersRewardPerPathway[_pathwayId]);
                amount = nativeRewards[_pathwayId] / numUsersRewardPerPathway[_pathwayId];
                require(amount > 0);
            }
            else{
                require(!userRewardedForPathwayERC20[_pathwayId][_ERC20Address][_msgSender()]);
                require(currentNumUsersRewardPerPathwayERC20[_pathwayId][_ERC20Address] < numUsersRewardPerPathway[_pathwayId]);
                amount = erc20Amounts[_pathwayId][_ERC20Address] / numUsersRewardPerPathway[_pathwayId];
                require(amount > 0);
            }
        }
        _verify(_msgSender(), _pathwayId, version, r, s, v);
        if(claimReward){
            if(native){
                (bool success, ) = payable(_msgSender()).call{value : amount}("");
                require(success);
                userRewardedForPathwayNative[_pathwayId][_msgSender()] = true;
                currentNumUsersRewardPerPathwayNative[_pathwayId]++;
            }
            else{
                IERC20(_ERC20Address).transfer(_msgSender(), amount);
                userRewardedForPathwayERC20[_pathwayId][_ERC20Address][_msgSender()] = true;
                currentNumUsersRewardPerPathwayERC20[_pathwayId][_ERC20Address]++;
            }
        }
        _localAdventureMint(_msgSender(), _pathwayId, _tokenURI, version);
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function _mintAdventurerBadge(address _to, string memory _pathwayId, string memory _tokenURI) internal {
      address adventurerBadgeAddress = adventurerAddress[_pathwayId];
      require(adventurerBadgeAddress != address(0), "invalid badge address");
      (bool success, bytes memory data) = adventurerBadgeAddress.call(abi.encodeWithSelector(bytes4(keccak256("balanceOf(address)")), _msgSender()));
      require(success);
      uint256 balance = abi.decode(data, (uint256));
      if(balance == 0){
          (success, data) = adventurerBadgeAddress.call(abi.encodeWithSelector(bytes4(keccak256("mint(address,uint256,string)")), _msgSender(), 1, _tokenURI));
          require(success);
          (success, data) = adventureFactory.call(abi.encodeWithSelector(bytes4(keccak256("setUserInfo(address,string)")), _msgSender(), _pathwayId));
          require(success);
      }
    }

    function _localAdventureMint(address _to, string memory _pathwayId, string memory _tokenURI, uint256 version) internal {
      if(mintTrackerByPathwayIdVersionMinter[_pathwayId][version][_to]){
          return;
      }
      uint256 newItemId;
      _tokenIds.increment();
      newItemId = _tokenIds.current();
      _mint(_msgSender(), newItemId);
      _setTokenURI(newItemId, _tokenURI);
      TokenInfo memory info = TokenInfo(_pathwayId, version);
      tokenInfoById[newItemId] = info;
      allMintersPerPathwayAndVersion[_pathwayId][version].push(_to);
      allTokenIdsPerPathwayAndVersion[_pathwayId][version].push(newItemId);
      mintTrackerByPathwayIdVersionMinter[_pathwayId][version][_to] = true;
  }

  function _createAdventurerNFT(string memory _pathwayId, string memory _projectId) internal {
      (bool success , bytes memory data) = adventureFactory.call(abi.encodeWithSelector(bytes4(
          keccak256("createNFTToken(string,bool,string)")
      ), _pathwayId, true, _projectId));
      require(success);
      address newTokenAddr = abi.decode(data, (address));
      adventurerAddress[_pathwayId] = newTokenAddr;
  }

  function verifyContractCall(string memory _pathwayId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint256 votesNeeded, bool onlyOneCheck) internal returns(bool voteAllowed, bool thresholdCheck){
       voteAllowed = verifyContract.metaDataVerify(
            _msgSender(),
            _pathwayId,
            _projectId,
            r[0],
            s[0],
            v[0]
        );
        require(voteAllowed);
        if(onlyOneCheck && status[_pathwayId] != PathwayStatus.PENDING){
            thresholdCheck = true;
        }
        else{
            thresholdCheck = verifyContract.thresholdVerify(
                _msgSender(),
                _pathwayId,
                votesNeeded,
                r[1],
                s[1],
                v[1]
            );
            require(thresholdCheck);
        }
   }

    function _verify(address from, string memory _pathwayId, uint256 payload, bytes32 r, bytes32 s, uint8 v) internal returns (bool){
      bytes32 hashRecover = keccak256(
            abi.encodePacked(
                from,
                address(this),
                block.chainid,
                nonces[_pathwayId][from],
                payload,
                _pathwayId
            )
        );
        (bool success, bytes memory data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("appSigningAddr()"))));
        require(success);
        address signer = abi.decode(data, (address));
        require (signer == ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    hashRecover
                )
            ),
            v,
            r,
            s
        ), "Incorrect signer");
        nonces[_pathwayId][from]++;
        return true;
  }

    function getContributors(string memory _pathwayId) external view returns(address[] memory){
        return contributors[_pathwayId];
    }

    function getAppDiamond() external view returns(address){
        return appDiamond;
    }

    function getAllAddrsByPathwayIDVersion(string memory _pathwayId, uint256 version) external view returns (address[] memory){
        return allMintersPerPathwayAndVersion[_pathwayId][version];
    }

    function getAllTokenIdsByPathwayIDVersion(string memory _pathwayId, uint256 version) external view returns (uint256[] memory){
        return allTokenIdsPerPathwayAndVersion[_pathwayId][version];
    }

    function getVersionsAndPathwayIDsByAdventurer(address adventurer) external view returns (uint256[] memory versions, string memory concatPathwayIds){
        uint256 numTokensOwned = balanceOf(adventurer);
        string memory currString = "";
        uint256[] memory tempVersions = new uint256[](numTokensOwned);
        if(numTokensOwned ==0){
            versions = tempVersions;
            concatPathwayIds= currString;
        }
        uint index = 0;
        while(index < numTokensOwned -1){
            TokenInfo memory info = tokenInfoById[tokenOfOwnerByIndex(adventurer, index)];
            tempVersions[index] = info.version;
            currString = string(abi.encodePacked(currString, info.pathwayId, "__"));
            index++;
        }
        TokenInfo memory lastInfo = tokenInfoById[tokenOfOwnerByIndex(adventurer, index)];
        tempVersions[index] = lastInfo.version;
        concatPathwayIds = string(abi.encodePacked(currString, lastInfo.pathwayId));
        versions = tempVersions;
    }

    function setAppDiamond(address newAppDiamond) external onlyOwner {
        appDiamond = newAppDiamond;
    }

    function setAdventureFactory(address newFactory) external onlyOwner {
        adventureFactory = newFactory;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721URIStorage, ERC721)
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721URIStorage, ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}