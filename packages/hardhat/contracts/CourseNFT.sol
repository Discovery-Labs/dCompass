// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassCourseNFT
 * @dev NFTs for creating courses
*/

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./RandomNumberConsumer.sol";
import "./Verify.sol";

contract CourseNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract;//VRF Contract used for randomness
    Verify verifyContract;//Verify contract instance
    address projectNFTAddress; // address for the projectNFTs
    mapping (uint => string) public statusStrings;
    mapping (string => bool) public courseMinted; // tracks if mint has been done
    mapping (string => address[]) internal contributors; //contributors to this course
    uint8[] internal rarityThresholds;//used for getting cutoffs of common, uncommon et al
    mapping (string => string) public projectIdforCourse;//the projectId that is the root
    mapping (string => CourseStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes per courseId;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of approved voters for CourseId

    enum CourseStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }

    event ReceiveCalled(address _caller, uint _value);
    event CourseApproved(string indexed _courseId);
    event NFTCourseMinted(address indexed _to, string indexed _tokenURI, string indexed _courseId);

    constructor(address _vrfAddress, uint8[] memory _initRarities, address _projectNFTAddress, address _verifyAddress)ERC721("dCompassCourse", "DCOMC"){
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

    function voteForApproval(address[] memory _contributors, string memory _courseId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint votesNeeded) public {
        require(status[_courseId] != CourseStatus.DENIED && status[_courseId] != CourseStatus.APPROVED, "finalized course");
        require(!reviewerVotes[_courseId][_msgSender()], "already voted for this project");
        bool voteAllowed = verifyContract.metaDataVerify(_msgSender(), _courseId, _projectId, r[0], s[0], v[0]);
        require(voteAllowed, "sender is not approved project voter");
        bool thresholdCheck = verifyContract.thresholdVerify(_msgSender(), _courseId, votesNeeded, r[1], s[1], v[1]);
        require(thresholdCheck, "incorrect votes needed sent");
        votes[_courseId]++;
        reviewerVotes[_courseId][_msgSender()] = true;
        if(status[_courseId] == CourseStatus.NONEXISTENT){
            require(_contributors.length >0, "empty array");
            contributors[_courseId] = _contributors;
            projectIdforCourse[_courseId] = _projectId;
            if(votesNeeded <= votes[_courseId]){
                status[_courseId] = CourseStatus.APPROVED;
                emit CourseApproved(_courseId);
                vrfContract.getRandomNumber(_courseId, contributors[_courseId].length);
            }
            else{
                status[_courseId] = CourseStatus.PENDING;
            }
        }
        else{
            if(votes[_courseId] >= votesNeeded){
                status[_courseId] = CourseStatus.APPROVED;
                emit CourseApproved(_courseId);
                vrfContract.getRandomNumber(_courseId, contributors[_courseId].length);
            }  
        }
    } 

    function createToken(uint32[] memory firstURIParts, uint256[] memory secondURIParts, string memory _courseId, string memory _projectId, bytes32[2] memory r, bytes32[2] memory s, uint8[2] memory v, uint votesNeeded) public returns(uint[] memory){
        require(!courseMinted[_courseId], "already minted");
        require(vrfContract.blockNumberResults(_courseId) > 0, "no request yet");
        require(contributors[_courseId].length == firstURIParts.length && firstURIParts.length==secondURIParts.length, "invalid arrs");
        bool mintAllowed = verifyContract.metaDataVerify(_msgSender(), _courseId, _projectId, r[0], s[0], v[0]);
        require(mintAllowed, "sender is not approved project minter");
        if(status[_courseId]==CourseStatus.PENDING){
            require(votesNeeded <= votes[_courseId], "not enough votes");
            bool thresholdCheck = verifyContract.thresholdVerify(_msgSender(), _courseId, votesNeeded, r[1], s[1], v[1]);
            require(thresholdCheck, "incorrect votes needed sent");
            status[_courseId] = CourseStatus.APPROVED;
        }
        require(status[_courseId] == CourseStatus.APPROVED, "can only mint courses in approved status");        

        //batch minting
        uint256[] memory newItems = new uint256[](contributors[_courseId].length);
        uint256 newItemId;
        string memory _tokenURI;

        for(uint i =0; i< contributors[_courseId].length; i++){
        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _tokenURI = string(abi.encodePacked("ipfs://f",uint32tohexstr(firstURIParts[i]),uint256tohexstr(secondURIParts[i])));
        
        _mint(contributors[_courseId][i], newItemId);
        _setTokenURI(newItemId, _tokenURI);
        
        emit NFTCourseMinted(contributors[_courseId][i], _tokenURI, _courseId);
        }
        courseMinted[_courseId] = true;
        return newItems;    
    }

    //helpers for building URIs
    function uint8tohexchar(uint8 i) internal pure returns (uint8) {
        return (i > 9) ?
            (i + 87) : // ascii a-f
            (i + 48); // ascii 0-9
    }
    
    function uint32tohexstr(uint32 i) internal pure returns (string memory) {
            bytes memory o = new bytes(8);
            uint32 mask = 0x0000000f;
            uint count =8;
            while (count>0){
                o[count-1]=bytes1(uint8tohexchar(uint8(i & mask)));
                if(count>1){
                    i = i >> 4;
                }
                count--; 
            }
            return string(o);
        }
 
    function uint256tohexstr(uint256 i) internal pure returns (string memory) {
        bytes memory o = new bytes(64);
        uint256 mask = 0x0000000000000000000000000000000f;
        
        uint count = 64;
        while (count>0){
            o[count-1]=bytes1(uint8tohexchar(uint8(i & mask)));
            if(count>1){
                i = i >> 4;
            }
            count--; 
        }
        return string(o);
    } 
}