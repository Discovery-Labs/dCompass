// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassBadgeNFT
 * @dev NFTs for creating badges
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
import "hardhat/console.sol";

contract BadgeNFT is ERC721URIStorage, ERC721Enumerable, Ownable{
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    
    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract;//VRF Contract used for randomness
    Verify verifyContract;//Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    address pathwayNFTAddress; // address for the pathwayNFTs
    address appDiamond;//address needed for checking valid erc20Addrs per chain
    address adventureFactory;//address of the adventure factory
    mapping (uint => string) public statusStrings;
    mapping (string => bool) public badgeMinted; // tracks if mint has been done
    mapping (string => address[]) internal contributors; //contributors to this quest
    mapping (string => address) public creator;//creator for given badgeId
    mapping (string => string) public pathwayIdforBadge;//the pathwayId that is the parent
    mapping (string => BadgeStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes per badgeId;
    mapping (string => uint) public votesReject;//tally of rejection votes per badgeId;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of approved voters for badgeId
    mapping (string => uint) public nativeRewards;//badge rewards in native token
    mapping (string => mapping(address => uint)) internal erc20Amounts;//badge reward Amts in other tokens
    mapping (string => bool) public nativeRefundClaimed;//badge refund claimed
    mapping (string => mapping(address => bool)) erc20RefundClaimed;//pathway erc20 refund claimed
    mapping (string => uint) public numUsersRewardPerBadge;//number of users rewarded per badge
    mapping (string => uint) public currentNumUsersRewardPerBadgeNative;//current number of users already claimed native reward per badge
    mapping (string => mapping ( address => uint)) public currentNumUsersRewardPerBadgeERC20;// current number of users already claimed reward per badge per ERC20 Address
    mapping (string => mapping(address => uint)) public nonces;//nonce for certain verify functions per address per badgeId
    mapping (string => address) public adventurerAddress;//address of adventurer NFT per badge Id

    //local adventure mappings
    //_badgeID => version => minterAddress => boolean
    mapping (string => mapping(uint => mapping(address => bool))) internal mintTrackerByBadgeIdVersionMinter;
    //_badgeID => version => addresses of all minters...only used for getter when necessary
    mapping (string => mapping(uint => address[])) internal allMintersPerBadgeAndVersion;
    //_badgeID => version => tokenIds of all minters...only used for getter when necessary
    mapping (string => mapping(uint => uint[])) internal allTokenIdsPerBadgeAndVersion;
    mapping (uint => TokenInfo) internal tokenInfoById;//will be used by getter

    //badgeId => ERC20Address => senderAddress => bool
    mapping (string => mapping(address => mapping (address => bool))) userRewardedForBadgeERC20;//has user received funds for this badge in ERC20Token Address
    mapping (string => mapping(address => bool)) public userRewardedForBadgeNative;//has user received funds for this badge in native token
    uint256 public fee = 1300; //number divided by 10000 for fee. for example 100 = 1%
    uint256 public creatorFee = 200; //number divided by 10000 for fee. for example 100 = 1%

    enum BadgeStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }

    struct TokenInfo{
        string badgeId;
        uint version;
    }

    event ReceiveCalled(address _caller, uint _value);
    event BadgeApproved(string indexed _badgeId);
    event NFTBadgeMinted(address indexed _to, string indexed _tokenURI, string indexed _badgeId);

    constructor(address _vrfAddress, address _projectNFTAddress, address _pathwayNFTAddress, address _verifyAddress)ERC721("dCompassBadge", "DCOMPB"){
        vrfContract = RandomNumberConsumer(_vrfAddress);
        verifyContract = Verify(_verifyAddress);
        projectNFTAddress = _projectNFTAddress;
        pathwayNFTAddress = _pathwayNFTAddress;
        statusStrings[0] = "NONEXISTENT";
        statusStrings[1] = "PENDING";
        statusStrings[2] = "DENIED";
        statusStrings[3] = "APPROVED";
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }

    function createBadgeAndVote(
        address[] memory _contributors,
        string memory _badgeId, 
        string memory _pathwayId,
        bytes32[2] memory r,
        bytes32[2] memory s, 
        uint8[2] memory v,
        uint votesNeeded,
        uint numUsersRewarded,
        bool[2] memory rewardsNative,
        address _ERC20Address,
        uint amount,
        address sender
    ) external {
        createBadge(_badgeId, _pathwayId, numUsersRewarded, rewardsNative[0], _ERC20Address, rewardsNative[1], amount, sender);
        voteForApproval(_contributors, _badgeId, _pathwayId, r, s, v, votesNeeded);
    }

    function createBadge(
        string memory _badgeId,
        string memory _pathwayId,
        uint numUsersRewarded,
        bool callRewards,
        address _ERC20Address,
        bool useNative,
        uint amount,
        address sender
    ) public payable {
            require(status[_badgeId] == BadgeStatus.NONEXISTENT);
            status[_badgeId] = BadgeStatus.PENDING;
            pathwayIdforBadge[_badgeId] = _pathwayId;
            numUsersRewardPerBadge[_badgeId] = numUsersRewarded;
            creator[_badgeId] = sender;
            if (callRewards){
                addBadgeCreationReward(_badgeId, _ERC20Address, useNative, amount);
            }
    }

    function voteForApproval(
        address[] memory _contributors,
        string memory _badgeId, 
        string memory _pathwayId,
        bytes32[2] memory r,
        bytes32[2] memory s, 
        uint8[2] memory v,
        uint votesNeeded
        ) public {
        require(
            status[_badgeId] == BadgeStatus.PENDING,
            "status not pending"
        );
        require(
            !reviewerVotes[_badgeId][_msgSender()],
            "already voted for this badge"
        );
        require(
            keccak256(abi.encodePacked(pathwayIdforBadge[_badgeId])) == keccak256(abi.encodePacked(_pathwayId)),
            "incorrect pathwayId"
        );
        (bool voteAllowed, bool thresholdCheck) = verifyContractCall(_badgeId,_pathwayId,r,s,v, votesNeeded, false);
        votes[_badgeId]++;
        reviewerVotes[_badgeId][_msgSender()] = true;
        if(votes[_badgeId] == 1){
            require(_contributors.length >0);
            contributors[_badgeId] = _contributors;
            if(votesNeeded <= votes[_badgeId]){
                status[_badgeId] = BadgeStatus.APPROVED;
                emit BadgeApproved(_badgeId);
                //vrfContract.getRandomNumber(_badgeId, contributors[_badgeId].length);
            }
        }
        else{
            if(votes[_badgeId] >= votesNeeded){
                status[_badgeId] = BadgeStatus.APPROVED;
                emit BadgeApproved(_badgeId);
                //vrfContract.getRandomNumber(_badgeId, contributors[_badgeId].length);
            }  
        }
    }

    function voteForRejection(string memory _badgeId, string memory _pathwayId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint256 votesNeeded) public {
        require(status[_badgeId] == BadgeStatus.PENDING);
        require(!reviewerVotes[_badgeId][_msgSender()]);
        require(
            keccak256(abi.encodePacked(pathwayIdforBadge[_badgeId])) == keccak256(abi.encodePacked(_pathwayId)),
            "incorrect pathwayId"
        );
        
        (bool voteAllowed, bool thresholdCheck) = verifyContractCall(_badgeId,_pathwayId,r,s,v, votesNeeded, false);
        votesReject[_badgeId]++;
        reviewerVotes[_badgeId][_msgSender()] = true;        
        if(votesReject[_badgeId] >= votesNeeded){
            status[_badgeId] = BadgeStatus.DENIED;
            /*(bool success,) = appWallet.call{value : stakePerProject[_projectId]}("");
            require(success, "transfer failed");*/
        }
    }

    function addBadgeCreationReward(string memory _badgeId, address _ERC20Address, bool useNative, uint amount) public payable{
        require (status[_badgeId] == BadgeStatus.PENDING || status[_badgeId] == BadgeStatus.APPROVED, "badge not pending/approved");
        require (numUsersRewardPerBadge[_badgeId] > 0, "no rewards");
        (bool success , bytes memory data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("appWallet()"))));
        require(success);
        address appWallet = abi.decode(data, (address));
        uint appPortion = (amount*fee)/10000;
        uint creatorPortion = (amount*creatorFee)/10000;
        if(useNative){
            require(msg.value >= amount + appPortion + creatorPortion, "insufficient funds");
            (success,) = payable(appWallet).call{value : appPortion}("");
            require(success);
            (success,) = payable(creator[_badgeId]).call{value : creatorPortion}("");
            require(success);
            nativeRewards[_badgeId] += amount;
            if(msg.value > amount + appPortion + creatorPortion){
                (success,) = payable(_msgSender()).call{value : msg.value - amount- appPortion - creatorPortion}("");
                require(success);
            }
        }
        else{
            require(_ERC20Address != address(0));
            (success, data) = pathwayNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectIdforPathway(string)")), pathwayIdforBadge[_badgeId]));
            require(success);
            string memory projectId = abi.decode(data, (string));
            (success, data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("checkApprovedERC20PerProjectByChain(string,uint256,address)")), projectId, block.chainid, _ERC20Address));
            require(success);
            success = abi.decode(data, (bool));
            require(success, "not approved");
            IERC20(_ERC20Address).transferFrom(_msgSender(), appWallet, appPortion);
            IERC20(_ERC20Address).transferFrom(_msgSender(), address(this), amount + creatorPortion);
            IERC20(_ERC20Address).transfer(creator[_badgeId], creatorPortion);
            erc20Amounts[_badgeId][_ERC20Address] += amount;
        }
    }

    function setNumberOfUsersRewarded(string memory _badgeId, uint256 newNumber, bytes32 r, bytes32 s, uint8 v) external {
        require(newNumber > numUsersRewardPerBadge[_badgeId] - 1, "BadgeNFT : invalid number");
        _verify(_msgSender(), _badgeId, newNumber, r, s, v);
        numUsersRewardPerBadge[_badgeId] = newNumber;
    }

    function claimRejectionRefund(string memory _badgeId, bool native, address _ERC20Address) external {
        require(status[_badgeId] == BadgeStatus.DENIED, "incorrect badge status");
        (bool success, bytes memory data) = pathwayNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectIdforPathway(string)")), pathwayIdforBadge[_badgeId]));
        require(success);
        string memory _projectId = abi.decode(data, (string));
        (success, data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectWallets(string)")), _projectId));
        require(success);
        address refundWallet = abi.decode(data, (address));
        require(refundWallet != address(0));
        if(native){
            require(!nativeRefundClaimed[_badgeId], "native reward already claimed");
            (success,) = payable(refundWallet).call{value : nativeRewards[_badgeId]}("");
            require(success);
            nativeRefundClaimed[_badgeId] = true;
        }
        else{
            require(!erc20RefundClaimed[_badgeId][_ERC20Address], "erc20 reward already claimed");
            IERC20(_ERC20Address).transfer(refundWallet, erc20Amounts[_badgeId][_ERC20Address]);
            erc20RefundClaimed[_badgeId][_ERC20Address] = true;
        }
    }

    function createToken(
        string memory _tokenURI,
        string memory _badgeId,
        string memory _pathwayId,
        bytes32[2] memory r,
        bytes32[2] memory s,
        uint8[2] memory v,
        uint256 votesNeeded
    ) public returns (uint256[] memory) {
        require(!badgeMinted[_badgeId], "already minted");
        (bool allowed,) = verifyContractCall(_badgeId,_pathwayId,r,s,v, votesNeeded, true);
        if (status[_badgeId] == BadgeStatus.PENDING) {
            require(votesNeeded <= votes[_badgeId], "insufficient votes");
            status[_badgeId] = BadgeStatus.APPROVED;
        }
        require(
            status[_badgeId] == BadgeStatus.APPROVED,
            "status not approved"
        );

        //TODO : this can later be made a require instead of if statement?
        bytes memory data;
        (allowed, data) = pathwayNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectIdforPathway(string)")), pathwayIdforBadge[_badgeId]));
        require(allowed);
        string memory _projectId = abi.decode(data, (string));

        (allowed, data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("projectDiamondAddrs(string)")), _projectId));
        require(allowed);
        //address projectDiamond = abi.decode(data, (address));
        /*if(projectDiamond != address(0)){
            (allowed, data) = projectDiamond.call(abi.encodeWithSelector(bytes4(keccak256("addPathwayId(string)")), _pathwayId));
            require(allowed);
        }*/

        //batch minting
        
        uint256[] memory newItems = new uint256[](
            contributors[_badgeId].length
        );
        uint256 newItemId;
        
        for (uint256 i = 0; i < contributors[_badgeId].length; i++) {
            _tokenIds.increment();
            newItemId = _tokenIds.current();

            _mint(contributors[_badgeId][i], newItemId);
            _setTokenURI(newItemId, _tokenURI);

            emit NFTBadgeMinted(
                contributors[_badgeId][i],
                _tokenURI,
                _pathwayId
            );
        }
        
        //_createAdventurerNFT(_badgeId, _pathwayId);

        badgeMinted[_badgeId] = true;
        return newItems;
    }

    function claimBadgeRewards(string memory _badgeId, bool native, address _ERC20Address, bytes32 r, bytes32 s, uint8 v, bool claimReward, string memory _tokenURI, uint256 version) external {
        uint amount;
        if(claimReward){
            if(native){
                require(!userRewardedForBadgeNative[_badgeId][_msgSender()]);
                require(currentNumUsersRewardPerBadgeNative[_badgeId] < numUsersRewardPerBadge[_badgeId]);
                amount = nativeRewards[_badgeId] / numUsersRewardPerBadge[_badgeId];
                require(amount > 0);
            }
            else{
                require(!userRewardedForBadgeERC20[_badgeId][_ERC20Address][_msgSender()]);
                require(currentNumUsersRewardPerBadgeERC20[_badgeId][_ERC20Address] < numUsersRewardPerBadge[_badgeId]);
                amount = erc20Amounts[_badgeId][_ERC20Address] / numUsersRewardPerBadge[_badgeId];
                require(amount > 0);
            }
        }
        _verify(_msgSender(), _badgeId, version, r, s, v);
        if(claimReward){
            if(native){
                (bool success, ) = payable(_msgSender()).call{value : amount}("");
                require(success);
                userRewardedForBadgeNative[_badgeId][_msgSender()] = true;
                currentNumUsersRewardPerBadgeNative[_badgeId]++;
            }
            else{
                IERC20(_ERC20Address).transfer(_msgSender(), amount);
                userRewardedForBadgeERC20[_badgeId][_ERC20Address][_msgSender()] = true;
                currentNumUsersRewardPerBadgeERC20[_badgeId][_ERC20Address]++;
            }
        }

        _localAdventureMint(_msgSender(), _badgeId, _tokenURI, version);
        //_mintAdventurerBadge(_msgSender(), _badgeId, _tokenURI);
    }

    function walletOfOwner(address _owner) public view returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

//   function _mintAdventurerBadge(address _to, string memory _badgeId, string memory _tokenURI) internal {
//       address adventurerBadgeAddress = adventurerAddress[_badgeId];
//       require(adventurerBadgeAddress != address(0), "invalid badge address");
//       (bool success, bytes memory data) = adventurerBadgeAddress.call(abi.encodeWithSelector(bytes4(keccak256("balanceOf(address)")), _msgSender()));
//       require(success);
//       uint256 balance = abi.decode(data, (uint256));
//       if(balance == 0){
//           (success, data) = adventurerBadgeAddress.call(abi.encodeWithSelector(bytes4(keccak256("mint(address,uint256,string)")), _msgSender(), 1, _tokenURI));
//           require(success);
//           (success, data) = adventureFactory.call(abi.encodeWithSelector(bytes4(keccak256("setUserInfo(address,string)")), _msgSender(), _badgeId));
//           require(success);
//       }
//   }

  function _localAdventureMint(address _to, string memory _badgeId, string memory _tokenURI, uint256 version) internal {
      if(mintTrackerByBadgeIdVersionMinter[_badgeId][version][_to]){
          return;
      }
      uint256 newItemId;
      _tokenIds.increment();
      newItemId = _tokenIds.current();
      _mint(_msgSender(), newItemId);
      _setTokenURI(newItemId, _tokenURI);
      TokenInfo memory info = TokenInfo(_badgeId, version);
      tokenInfoById[newItemId] = info;
      allMintersPerBadgeAndVersion[_badgeId][version].push(_to);
      allTokenIdsPerBadgeAndVersion[_badgeId][version].push(newItemId);
      mintTrackerByBadgeIdVersionMinter[_badgeId][version][_to] = true;
  }

//   function _createAdventurerNFT(string memory _badgeId, string memory _pathwayId) internal {
//       (bool success , bytes memory data) = adventureFactory.call(abi.encodeWithSelector(bytes4(
//           keccak256("createNFTToken(string,bool,string)")
//       ), _badgeId, false, _pathwayId));
//       require(success);
//       address newTokenAddr = abi.decode(data, (address));
//       adventurerAddress[_badgeId] = newTokenAddr;
//   }

   function verifyContractCall(string memory _badgeId, string memory _pathwayId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint256 votesNeeded, bool onlyOneCheck) internal returns(bool voteAllowed, bool thresholdCheck){
       voteAllowed = verifyContract.metaDataVerify(
            _msgSender(),
            _badgeId,
            _pathwayId,
            r[0],
            s[0],
            v[0]
        );
        require(voteAllowed);
        if(onlyOneCheck && status[_badgeId] != BadgeStatus.PENDING){
            thresholdCheck = true;
        }
        else{
            thresholdCheck = verifyContract.thresholdVerify(
                _msgSender(),
                _badgeId,
                votesNeeded,
                r[1],
                s[1],
                v[1]
            );
            require(thresholdCheck);
        }
   }

  function _verify(address from, string memory _badgeId, uint256 payload, bytes32 r, bytes32 s, uint8 v) internal returns (bool){
      bytes32 hashRecover = keccak256(
            abi.encodePacked(
                from,
                address(this),
                block.chainid,
                nonces[_badgeId][from],
                payload,
                _badgeId
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
        nonces[_badgeId][from]++;
        return true;
  }

    function getContributors(string memory _badgeId) external view returns(address[] memory){
        return contributors[_badgeId];
    }

    function getAppDiamond() external view returns(address){
        return appDiamond;
    }

    function getAllAddrsByBadgeIDVersion(string memory _badgeId, uint256 version) external view returns (address[] memory){
        return allMintersPerBadgeAndVersion[_badgeId][version];
    }

    function getAllTokenIdsByBadgeIDVersion(string memory _badgeId, uint256 version) external view returns (uint256[] memory){
        return allTokenIdsPerBadgeAndVersion[_badgeId][version];
    }

    function getVersionsAndBadgeIDsByAdventurer(address adventurer) external view returns (uint256[] memory versions, string memory concatBadgeIds){
        uint256 numTokensOwned = balanceOf(adventurer);
        string memory currString = "";
        uint256[] memory tempVersions = new uint256[](numTokensOwned);
        if(numTokensOwned ==0){
            versions = tempVersions;
            concatBadgeIds= currString;
        }
        uint index = 0;
        while(index < numTokensOwned -1){
            TokenInfo memory info = tokenInfoById[tokenOfOwnerByIndex(adventurer, index)];
            tempVersions[index] = info.version;
            currString = string(abi.encodePacked(currString, info.badgeId, "__"));
            index++;
        }
        TokenInfo memory lastInfo = tokenInfoById[tokenOfOwnerByIndex(adventurer, index)];
        tempVersions[index] = lastInfo.version;
        concatBadgeIds = string(abi.encodePacked(currString, lastInfo.badgeId));
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
        super._beforeTokenTransfer(from,to,tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }
    
     function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721) returns (bool){
         return super.supportsInterface(interfaceId);
     }
     
     function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorage, ERC721) returns (string memory){
         return super.tokenURI(tokenId);
     }
}