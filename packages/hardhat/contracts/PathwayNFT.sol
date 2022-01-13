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
import "./RandomNumberConsumer.sol";
import "./Verify.sol";

contract PathwayNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract; //VRF Contract used for randomness
    Verify verifyContract; //Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    mapping(uint256 => string) public statusStrings;
    mapping(string => bool) public pathwayMinted; // tracks if mint has been done
    mapping(string => address[]) internal contributors; //contributors to this course
    uint8[] internal rarityThresholds; //used for getting cutoffs of common, uncommon et al
    mapping(string => string) public projectIdforPathway; //the projectId that is the root
    mapping(string => PathwayStatus) public status;
    mapping(string => uint256) public votes; //tally of approved votes per pathwayId;
    mapping(string => mapping(address => bool)) public reviewerVotes; //vote record of approved voters for PathwayId

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
            "finalized badge"
        );
        require(
            !reviewerVotes[_pathwayId][_msgSender()],
            "already voted for this badge"
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
        bool mintAllowed = verifyContract.metaDataVerify(
            _msgSender(),
            _pathwayId,
            _projectId,
            r[0],
            s[0],
            v[0]
        );
        require(mintAllowed, "sender is not approved project minter");
        if (status[_pathwayId] == PathwayStatus.PENDING) {
            require(votesNeeded <= votes[_pathwayId], "not enough votes");
            bool thresholdCheck = verifyContract.thresholdVerify(
                _msgSender(),
                _pathwayId,
                votesNeeded,
                r[1],
                s[1],
                v[1]
            );
            require(thresholdCheck, "incorrect votes needed sent");
            status[_pathwayId] = PathwayStatus.APPROVED;
        }
        require(
            status[_pathwayId] == PathwayStatus.APPROVED,
            "can only mint for pathways in approved status"
        );

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
