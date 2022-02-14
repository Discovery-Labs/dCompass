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
            status[_pathwayId] != PathwayStatus.DENIED &&
                status[_pathwayId] != PathwayStatus.APPROVED,
            "finalized pathway"
        );
        require(
            !reviewerVotes[_pathwayId][_msgSender()],
            "already voted for this pathway"
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
        if (status[_pathwayId] == PathwayStatus.NONEXISTENT) {
            require(_contributors.length > 0, "empty array");
            contributors[_pathwayId] = _contributors;
            projectIdforPathway[_pathwayId] = _projectId;
            if (votesNeeded <= votes[_pathwayId]) {
                status[_pathwayId] = PathwayStatus.APPROVED;
                emit PathwayApproved(_pathwayId);
                //vrfContract.getRandomNumber(_pathwayId, contributors[_pathwayId].length);
            } else {
                status[_pathwayId] = PathwayStatus.PENDING;
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
    function addPathwayCreationReward(string memory _pathwayId, address _ERC20Address, bool useNative, uint amount) external payable{
        require (status[_pathwayId] == PathwayStatus.PENDING, "pathway not pending");
        if(useNative){
            require(msg.value >= amount, "not enough sent");
            nativeRewards[_pathwayId] += msg.value;
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
            IERC20(_ERC20Address).transferFrom(_msgSender(), address(this), amount);
            erc20Amounts[_pathwayId][_ERC20Address] += amount;
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