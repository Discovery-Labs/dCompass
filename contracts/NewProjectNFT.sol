// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

/**
 * @title dCompassProjectNFT
 * @dev NFTs for creating project
*/

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract ProjectNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    Counters.Counter private _multiSigRequest;
    
    
    mapping (address => bool) public reviewers;
    uint128 public multiSigThreshold; //gives minimum multisig percentage (30 = 30% )
    uint128 public numReviewers;//number of Reviewers. Needed for threshold calculation
    address public vrfAddress; //VRF Contract used for randomness
    address payable _projectWallet;//sign in a script and also withdraw
    enum ProjectStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }
    
    //mapping (string => mapping (address => bool)) public contributors; //possibly keep this on ceramic?
    mapping (string => address[]) public contributors;
    mapping (string => ProjectStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of reviewers for ProjectId
    mapping (string => uint16[]) public rarities; // rarities of each image uint16 used for pakcing purposes
    
    
    //Verify private signVerifyContract; //contract to verify the signatures 

    event NFTProjectMinted(address indexed _to, string indexed _tokenURI, string indexed _questId);
    event ReceiveCalled(address _caller, uint _value);


    constructor(address payable _walletAddress, address[] memory _reviewers, address _vrfAddress, uint128 _initialThreshold) ERC721("dCompassProject", "DCOMPROJ") public{
        require(_reviewers.length > 0, "Must have at least 1 reviewer");
        require(_initialThreshold > 0 && _initialThreshold <=100, "invalid threshold");
        multiSigThreshold = _initialThreshold;
        vrfAddress = _vrfAddress;
        _projectWallet = _walletAddress;
        for (uint i=0; i<_reviewers.length; i++){
            if(_reviewers[i]!= address(0) && !reviewers[_reviewers[i]]){
                reviewers[_reviewers[i]] = true;
                numReviewers++;
            }
        }
        
    } 

    modifier onlyReviewer(){
        require(reviewers[_msgSender()], "not a reviewer");
        _;
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }
    
    function voteForApproval(address[] memory _contributors, uint16[] memory _rarities, string memory _projectId) public onlyReviewer{
        require(status[_projectId] != ProjectStatus.DENIED && status[_projectId] != ProjectStatus.APPROVED, "finalized project");
        votes[_projectId]++;
        reviewerVotes[_projectId][_msgSender()] = true;
        if(status[_projectId] == ProjectStatus.NONEXISTENT){
            require(_contributors.length >0 && _rarities.length > 0, "empty array");
            rarities[_projectId] = _rarities;
            contributors[_projectId] = _contributors;
            if(multiSigThreshold*numReviewers/100 == 0){
                status[_projectId] = ProjectStatus.APPROVED;
                approveMint(_projectId);
            }
            else{
                status[_projectId] = ProjectStatus.PENDING;
            }
        }
        else{
            uint minVotes = multiSigThreshold*numReviewers/100;
            if(minVotes * 100 < multiSigThreshold*numReviewers){
                minVotes++;
            }
            if(votes[_projectId] >= minVotes){
                status[_projectId] = ProjectStatus.APPROVED;
                approveMint(_projectId);
            }
            
        }
    }

    function approveMint(string memory _projectId) internal {
        (bool success, ) = vrfAddress.call(abi.encodeWithSelector(bytes4(keccak256("getRandomNumber(string)")), _projectId));
        require(success, "approve call failed");

    }

    function createToken(address[] memory _mintAddresses, uint32[] memory firstURIParts, uint256[] memory secondURIParts, string memory _projectId) public returns(uint[] memory){
        require(status[_projectId] == ProjectStatus.APPROVED, "job not approved yet");
        require(reviewers[_msgSender()] || payable(_msgSender()) == _projectWallet , "sender not allowed to mint");
        //uint256 _randomNumber = randomNumberContract.requestResults(requestId);
        uint256[] memory newItems = new uint256[](_mintAddresses.length);
        uint256 newItemId;
        string memory _tokenURI;

        for(uint i =0; i<_mintAddresses.length; i++){
        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _tokenURI = string(abi.encodePacked("ipfs://f",uint32tohexstr(firstURIParts[i]),uint256tohexstr(secondURIParts[i])));
        
        _mint(_mintAddresses[i], newItemId);
        _setTokenURI(newItemId, _tokenURI);
        
        emit NFTProjectMinted(_mintAddresses[i], _tokenURI, _projectId);
        }
        return newItems;    
    }

    function addReviewer(address _reviewer) public onlyReviewer {
        require (!reviewers[_reviewer], "already reviewer");
        reviewers[_reviewer]=true;
        numReviewers++;
    }
    
    //helpers for building URIs
    function uint8tohexchar(uint8 i) public pure returns (uint8) {
        return (i > 9) ?
            (i + 87) : // ascii a-f
            (i + 48); // ascii 0-9
    }
    
    function uint32tohexstr(uint32 i) public pure returns (string memory) {
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
 
    function uint256tohexstr(uint256 i) public pure returns (string memory) {
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