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
import "./RandomNumberConsumer.sol";
import "./Verify.sol";

contract PathwayNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract; //VRF Contract used for randomness
    Verify verifyContract; //Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    address appDiamond;//address needed for checking valid erc20Addrs per chain
    mapping(uint256 => string) public statusStrings;
    mapping(string => bool) public pathwayMinted; // tracks if mint has been done
    mapping(string => address[]) internal contributors; //contributors to this pathway
    uint8[] internal rarityThresholds; //used for getting cutoffs of common, uncommon et al
    mapping(string => string) public projectIdforPathway; //the projectId that is the root
    mapping(string => PathwayStatus) public status;
    mapping(string => uint256) public votes; //tally of approved votes per pathwayId;
    mapping (string => uint) public votesReject;//tally of rejection votes per pathwayId;
    mapping(string => mapping(address => bool)) public reviewerVotes; //vote record of approved voters for PathwayId
    mapping (string => uint) public nativeRewards;//pathway rewards in native token
    mapping (string => mapping(address => uint)) internal erc20Amounts;//pathway reward Amts in other tokens
    mapping (string => uint) public numUsersRewardPerPathway;//number of users rewarded per pathway
    mapping (string => uint) public currentNumUsersRewardPerPathwayNative;//current number of users already claimed native reward per pathway
    mapping (string => mapping ( address => uint)) public currentNumUsersRewardPerPathwayERC20;// currentnumber of users already claimed reward per pathway per ERC20 Address
    
    //pathwayId => ERC20Address => senderAddress => bool
    mapping (string => mapping(address => mapping (address => bool))) userRewardedForPathwayERC20;//has user received funds for this pathway in ERC20Token Address
    mapping (string => mapping(address => bool)) public userRewardedForPathwayNative;//has user received funds for this pathway in native token
    uint256 public fee = 1500; //number divided by 10000 for fee. for example 100 = 1%

    enum PathwayStatus {
        NONEXISTENT,
        PENDING,
        DENIED,
        APPROVED
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
    ) ERC721("dCompassBadge", "DCOMPB") {
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

    function createPathway(
        string memory _pathwayId,
        string memory _projectId,
        uint numUsersRewarded,
        bool callRewards,
        address _ERC20Address,
        bool useNative,
        uint amount
    ) external payable {
            require(status[_pathwayId] == PathwayStatus.NONEXISTENT);
            status[_pathwayId] = PathwayStatus.PENDING;
            projectIdforPathway[_pathwayId] = _projectId;
            numUsersRewardPerPathway[_pathwayId] = numUsersRewarded;
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
        bool voteAllowed = verifyContract.metaDataVerify(
            _msgSender(),
            _pathwayId,
            _projectId,
            r[0],
            s[0],
            v[0]
        );
        require(voteAllowed, "sender is not approved project voter");
        bool thresholdCheck = verifyContract.thresholdVerify(
            _msgSender(),
            _pathwayId,
            votesNeeded,
            r[1],
            s[1],
            v[1]
        );
        require(thresholdCheck, "incorrect votes needed sent");
        votes[_pathwayId]++;
        reviewerVotes[_pathwayId][_msgSender()] = true;
        if (votes[_pathwayId] == 0) {
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
        bool voteAllowed = verifyContract.metaDataVerify(
            _msgSender(),
            _pathwayId,
            _projectId,
            r[0],
            s[0],
            v[0]
        );
        require(voteAllowed, "sender is not approved project voter");
        bool thresholdCheck = verifyContract.thresholdVerify(
            _msgSender(),
            _pathwayId,
            votesNeeded,
            r[1],
            s[1],
            v[1]
        );
        require(thresholdCheck, "incorrect votes needed sent");
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
        require (status[_pathwayId] == PathwayStatus.PENDING, "pathway not pending");
        require (numUsersRewardPerPathway[_pathwayID] > 0, "no user rewards");
        (bool success , bytes memory data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("appWallet()"))));
        require(success);
        address appWallet = abi.decode(data, (address));
        uint appPortion = (amount*fee)/10000;
        if(useNative){
            require(msg.value >= amount, "not enough sent");
            (success,) = payable(appWallet).call{value : appPortion}("");
            require(success);
            nativeRewards[_pathwayId] += amount - appPortion;
            if(msg.value > amount){
                (bool success,) = payable(_msgSender()).call{value : msg.value - amount}("");
                require(success);
            }
        }
        else{
            require(_ERC20Address != address(0));
            (bool success, bytes memory data) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("checkApprovedERC20PerProjectByChain(string,uint256,address)")), projectIdforPathway[_pathwayId],block.chainid, _ERC20Address));
            require(success);
            success = abi.decode(data, (bool));
            require(success, "ERC20 not approved");
            IERC20(_ERC20Address).transferFrom(_msgSender(), appWallet, appPortion);
            IERC20(_ERC20Address).transferFrom(_msgSender(), address(this), amount - appPortion);
            erc20Amounts[_pathwayId][_ERC20Address] += amount - appPortion;
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
        //require(vrfContract.blockNumberResults(_pathwayId) > 0, "no request yet");
        bool allowed = verifyContract.metaDataVerify(
            _msgSender(),
            _pathwayId,
            _projectId,
            r[0],
            s[0],
            v[0]
        );
        require(allowed, "sender is not approved project minter");
        if (status[_pathwayId] == PathwayStatus.PENDING) {
            require(votesNeeded <= votes[_pathwayId], "not enough votes");
            allowed = verifyContract.thresholdVerify(
                _msgSender(),
                _pathwayId,
                votesNeeded,
                r[1],
                s[1],
                v[1]
            );
            require(allowed, "incorrect votes needed sent");
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

    function claimPathwayRewards(string memory _pathwayId, bool native, address _ERC20Address, bytes32 r, bytes32 s, uint8 v) external {
        uint amount;
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
        bytes32 hashRecover = keccak256(
            abi.encodePacked(
                _msgSender(),
                address(this),
                block.chainid,
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
        if(native){
            (success, ) = payable(_msgSender()).call{value : amount}("");
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

    function setAppDiamond(address newAppDiamond) external onlyOwner {
        appDiamond = newAppDiamond;
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