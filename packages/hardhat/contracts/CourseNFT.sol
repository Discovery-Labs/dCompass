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



contract CourseNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract;//VRF Contract used for randomness
    address projectNFTAddress; // address for the projectNFTs
    //mapping (string => mapping (address => bool)) public courseReviewers;//projectId => contributorAddress=>reviewer
    //mapping (string => uint16[]) public rarityThresholds; // rarity of each image threshold per courseId, uint16 used for packing purposes
    mapping (string => bool) public courseMinted; // tracks if mint has been done
    mapping (string => address[]) internal contributors; //contributors to this course
    uint[] rarityThresholds;
    mapping (string => string) public projectIdforCourse;//the projectId that is the root
    mapping (string => CourseStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes per courseId;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of reviewers for CourseId

    enum CourseStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }

    event ReceiveCalled(address _caller, uint _value);
    event CourseApproved(string indexed _courseId);
    event NFTCourseMinted(address indexed _to, string indexed _tokenURI, string indexed _courseId);

    constructor(address _vrfAddress, uint[] memory _initRarities, address _projectNFTAddress)ERC721("dCompassCourse", "DCOMC"){
        vrfContract = RandomNumberConsumer(_vrfAddress);
        uint rarityTotal = 0;
        for (uint8 i =0; i<_initRarities.length; i++){
            rarityTotal += _initRarities[i];
        }
        require(rarityTotal == 100, "rarities do not add to 100");
        rarityThresholds = _initRarities;
        projectNFTAddress = _projectNFTAddress;
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }

    /*
    function approveMint(string memory _courseId) internal {
        //(bool success, uint number) = vrfAddress.call(abi.encodeWithSelector(bytes4(keccak256("getRandomNumber(string)")), _courseId));
        //require(success, "approve call failed");
        vrfContract.getRandomNumber(_courseId);
    }*/

    function voteForApproval(address[] memory _contributors, string memory _courseId, string memory _projectId) public {
        /*
        1) store array of reviewers from projectID in memory
        2) iterate and check msgSender is in array
        3) get projectThreshold from projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectThresholds(string)")), _projectId));
        */
        require(status[_courseId] != CourseStatus.DENIED && status[_courseId] != CourseStatus.APPROVED, "finalized course");
        (bool success, bytes memory data) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("getContributors(string)")), _projectId));
        require(success, "project reviewer call unsuccessful");
        (address[] memory reviewers) = abi.decode(data, (address[]));
        bool isReviewer = false;
        for(uint8 i=0; i < reviewers.length; i++){
            if(_msgSender() == reviewers[i]){
                isReviewer = true;
            }
        }
        require(isReviewer, "sender is not a project contributor");
        require(!reviewerVotes[_courseId][_msgSender()], "already voted for this project");
        (bool successThreshold, bytes memory thresholdData) = projectNFTAddress.call(abi.encodeWithSelector(bytes4(keccak256("projectThresholds(string)")), _projectId));
        require(successThreshold, "project threshold call unsuccessful");
        (uint256 threshold) = abi.decode(thresholdData, (uint256));
        votes[_courseId]++;
        reviewerVotes[_courseId][_msgSender()] = true;
        if(status[_courseId] == CourseStatus.NONEXISTENT){
            require(_contributors.length >0, "empty array");
            //rarityThresholds[_courseId] = _rarities;
            contributors[_courseId] = _contributors;
            if(threshold*reviewers.length/100 == 0){
                status[_courseId] = CourseStatus.APPROVED;
                emit CourseApproved(_courseId);
                //approveMint(_projectId);
                vrfContract.getRandomNumber(_courseId);
            }
            else{
                status[_courseId] = CourseStatus.PENDING;
            }
        }
        else{
            uint minVotes = threshold*reviewers.length/100;
            if(minVotes * 100 < threshold*reviewers.length){
                minVotes++;
            }
            if(votes[_courseId] >= minVotes){
                status[_courseId] = CourseStatus.APPROVED;
                emit CourseApproved(_courseId);
                //approveMint(_projectId);
                vrfContract.getRandomNumber(_courseId);
            }  
        }
    }

    function createToken(uint32[] memory firstURIParts, uint256[] memory secondURIParts, string memory _courseId, uint16[] memory raritiesUsed) public returns(uint[] memory){
        require(!courseMinted[_courseId], "already minted");
        require(vrfContract.blockNumberResults(_courseId) > 0, "no request yet");
        require(contributors[_courseId].length == raritiesUsed.length, "invalid rarities");

        //check on chain that correct image rarities were derived
        uint256 _randomNumber = vrfContract.requestResults(_courseId);
        uint256[] memory checkRarities = new uint256[](contributors[_courseId].length);
        uint currentIndex = 0;
        uint target;
        bool allMatch=true;

        while(currentIndex < contributors[_courseId].length){
            target = (uint256(keccak256(abi.encode(_randomNumber, currentIndex))) % 100) + 1;
            checkRarities[currentIndex] = target;
            if (target != raritiesUsed[currentIndex]){
                allMatch = false;
            }
            currentIndex++;
        }

        require(allMatch, "incorrect rarities");

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