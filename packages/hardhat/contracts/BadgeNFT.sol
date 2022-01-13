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
import "./RandomNumberConsumer.sol";
import "./Verify.sol";

contract BadgeNFT is ERC721URIStorage, ERC721Enumerable, Ownable{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract;//VRF Contract used for randomness
    Verify verifyContract;//Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    mapping (uint => string) public statusStrings;
    mapping (string => bool) public badgeMinted; // tracks if mint has been done
    mapping (string => address[]) internal contributors; //contributors to this course
    uint8[] internal rarityThresholds;//used for getting cutoffs of common, uncommon et al
    mapping (string => string) public projectIdforCourse;//the projectId that is the root
    mapping (string => BadgeStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes per courseId;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of approved voters for CourseId

    enum BadgeStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }

    event ReceiveCalled(address _caller, uint _value);
    event BadgeApproved(string indexed _badgeId);
    event NFTBadgeMinted(address indexed _to, string indexed _tokenURI, string indexed _badgeId);

    constructor(address _vrfAddress, uint8[] memory _initRarities, address _projectNFTAddress, address _verifyAddress)ERC721("dCompassBadge", "DCOMPB"){
        vrfContract = RandomNumberConsumer(_vrfAddress);
        verifyContract = Verify(_verifyAddress);
        uint rarityTotal = 0;
        for (uint8 i =0; i<_initRarities.length; i++){
            rarityTotal += _initRarities[i];
        }
        require(rarityTotal == 100, "rarities do not add to 100");
        rarityThresholds = _initRarities;
        projectNFTAddress = _projectNFTAddress;
        statusStrings[0] = "NONEXISTENT";
        statusStrings[1] = "PENDING";
        statusStrings[2] = "DENIED";
        statusStrings[3] = "APPROVED";
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }

    function voteForApproval(address[] memory _contributors, string memory _badgeId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint votesNeeded) public {
        require(status[_badgeId] != BadgeStatus.DENIED && status[_badgeId] != BadgeStatus.APPROVED, "finalized badge");
        require(!reviewerVotes[_badgeId][_msgSender()], "already voted for this badge");
        bool voteAllowed = verifyContract.metaDataVerify(_msgSender(), _badgeId, _projectId, r[0], s[0], v[0]);
        require(voteAllowed, "sender is not approved project voter");
        bool thresholdCheck = verifyContract.thresholdVerify(_msgSender(), _badgeId, votesNeeded, r[1], s[1], v[1]);
        require(thresholdCheck, "incorrect votes needed sent");
        votes[_badgeId]++;
        reviewerVotes[_badgeId][_msgSender()] = true;
        if(status[_badgeId] == BadgeStatus.NONEXISTENT){
            require(_contributors.length >0, "empty array");
            contributors[_badgeId] = _contributors;
            projectIdforCourse[_badgeId] = _projectId;
            if(votesNeeded <= votes[_badgeId]){
                status[_badgeId] = BadgeStatus.APPROVED;
                emit BadgeApproved(_badgeId);
                vrfContract.getRandomNumber(_badgeId, contributors[_badgeId].length);
            }
            else{
                status[_badgeId] = BadgeStatus.PENDING;
            }
        }
        else{
            if(votes[_badgeId] >= votesNeeded){
                status[_badgeId] = BadgeStatus.APPROVED;
                emit BadgeApproved(_badgeId);
                vrfContract.getRandomNumber(_badgeId, contributors[_badgeId].length);
            }  
        }
    } 

    function createToken(string memory _tokenURI, string memory _badgeId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint votesNeeded) public returns(uint[] memory){
        require(!badgeMinted[_badgeId], "already minted");
        require(vrfContract.blockNumberResults(_badgeId) > 0, "no request yet");
        bool mintAllowed = verifyContract.metaDataVerify(_msgSender(), _badgeId, _projectId, r[0], s[0], v[0]);
        require(mintAllowed, "sender is not approved project minter");
        if(status[_badgeId]==BadgeStatus.PENDING){
            require(votesNeeded <= votes[_badgeId], "not enough votes");
            bool thresholdCheck = verifyContract.thresholdVerify(_msgSender(), _badgeId, votesNeeded, r[1], s[1], v[1]);
            require(thresholdCheck, "incorrect votes needed sent");
            status[_badgeId] = BadgeStatus.APPROVED;
        }
        require(status[_badgeId] == BadgeStatus.APPROVED, "can only mint badges in approved status");        

        //batch minting
        uint256[] memory newItems = new uint256[](contributors[_badgeId].length);
        uint256 newItemId;

        for(uint i =0; i< contributors[_badgeId].length; i++){
        _tokenIds.increment();
        newItemId = _tokenIds.current();
        
        _mint(contributors[_badgeId][i], newItemId);
        _setTokenURI(newItemId, _tokenURI);
        
        emit NFTBadgeMinted(contributors[_badgeId][i], _tokenURI, _badgeId);
        }
        badgeMinted[_badgeId] = true;
        return newItems;    
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