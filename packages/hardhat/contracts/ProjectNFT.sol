// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

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
    address payable projectWallet;//sign in a script and also withdraw
    address payable appDiamond;//address of the app level diamond
    enum ProjectStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }
    
    mapping (string => address[]) internal contributors;
    mapping (uint => string) public statusStrings;
    mapping (string => ProjectStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of reviewers for ProjectId
    //mapping (string => uint16[]) public rarities; // rarities of each image uint16 used for pakcing purposes
    mapping (string => bool) public projectMinted; // tracks if mint has been done
    mapping (string => uint) public projectThresholds;// threshold for the project contributors to approve courses
    
    event NFTProjectMinted(address indexed _to, string indexed _tokenURI, string indexed _questId);
    event ReceiveCalled(address _caller, uint _value);
    event ProjectApproved(string indexed _projectId);

    constructor(address payable _walletAddress, address[] memory _reviewers, uint128 _initialThreshold) ERC721("dCompassProject", "DCOMPROJ") public{
        require(_reviewers.length > 0, "Must have at least 1 reviewer");
        require(_initialThreshold > 0 && _initialThreshold <=100, "invalid threshold");
        multiSigThreshold = _initialThreshold;
        projectWallet = _walletAddress;
        for (uint i=0; i<_reviewers.length; i++){
            if(_reviewers[i]!= address(0) && !reviewers[_reviewers[i]]){
                reviewers[_reviewers[i]] = true;
                numReviewers++;
            }
        }
        statusStrings[0] = "NONEXISTENT";
        statusStrings[1] = "PENDING";
        statusStrings[2] = "DENIED";
        statusStrings[3] = "APPROVED";
    } 

    modifier onlyReviewer(){
        require(reviewers[_msgSender()], "not a reviewer");
        _;
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }
    
    function voteForApproval(address[] memory _contributors, uint _threshold, string memory _projectId) public onlyReviewer{
        require(status[_projectId] != ProjectStatus.DENIED && status[_projectId] != ProjectStatus.APPROVED, "finalized project");
        require(!reviewerVotes[_projectId][_msgSender()], "already voted for this project");
        votes[_projectId]++;
        reviewerVotes[_projectId][_msgSender()] = true;
        if(status[_projectId] == ProjectStatus.NONEXISTENT){
            require(_contributors.length >0, "empty array");
            require(_threshold > 0 && _threshold <= 100, "invalid threshold");
            //rarities[_projectId] = _rarities;
            contributors[_projectId] = _contributors;
            projectThresholds[_projectId] = _threshold;
            if(multiSigThreshold*numReviewers/100 == 0){
                status[_projectId] = ProjectStatus.APPROVED;
                emit ProjectApproved(_projectId);
                //approveMint(_projectId);
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
                emit ProjectApproved(_projectId);
                //approveMint(_projectId);
            }  
        }
    }
    

    function createToken(uint32[] memory firstURIParts, uint256[] memory secondURIParts, string memory _projectId) public onlyReviewer returns(uint[] memory){
        require(status[_projectId] == ProjectStatus.APPROVED, "job not approved yet");
        require(!projectMinted[_projectId], "already minted");
        require(firstURIParts.length == secondURIParts.length && firstURIParts.length == contributors[_projectId].length, "incorrect arrs");

        //batch minting
        uint256[] memory newItems = new uint256[](contributors[_projectId].length);
        uint256 newItemId;
        string memory _tokenURI;

        for(uint i =0; i< contributors[_projectId].length; i++){
        _tokenIds.increment();
        newItemId = _tokenIds.current();
        _tokenURI = string(abi.encodePacked("ipfs://f",uint32tohexstr(firstURIParts[i]),uint256tohexstr(secondURIParts[i])));
        
        _mint(contributors[_projectId][i], newItemId);
        _setTokenURI(newItemId, _tokenURI);

        //set the approval within app Diamond contract
        (bool success, ) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("setApproved(string)")), _projectId));
        require(success, "diamond approval failed");
        
        emit NFTProjectMinted(contributors[_projectId][i], _tokenURI, _projectId);
        }
        projectMinted[_projectId] = true;
        return newItems;    
    }

    function addReviewer(address _reviewer) public onlyReviewer {
        require (!reviewers[_reviewer], "already reviewer");
        reviewers[_reviewer]=true;
        numReviewers++;
    }

    function setStatusString(uint index, string memory newName) external onlyReviewer{
        statusStrings[index] = newName;
    }

    function addProjectContributor(string memory _projectId, address newContributor) external{
        require(status[_projectId]!= ProjectStatus.NONEXISTENT, "project doesn't exist");
        require(!projectMinted[_projectId], "project already minted");
        bool isAllowed = reviewers[_msgSender()];
        bool notContributor = true;
        if(!isAllowed){
            address[] memory currContributors = contributors[_projectId];
            for(uint i=0; i<currContributors.length; i++){
                if(_msgSender() == currContributors[i]){
                    isAllowed = true;
                }
                if(newContributor == currContributors[i]){
                    notContributor = false;
                }
            }
        }
        require(isAllowed, "must be a project contributor or reviewer");
        require(notContributor, "already a contributor on project");
        contributors[_projectId].push(newContributor);
    }

    function setThreshold(uint128 _newThreshold) public onlyReviewer{
        require(_newThreshold > 0 && _newThreshold <=100, "invalid threshold");
        multiSigThreshold = _newThreshold;
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

    function getContributors(string memory _projectId) external view returns(address[] memory){
        return contributors[_projectId];
    }

    function setAppDiamond(address payable _appDiamond) external onlyReviewer{
        require(_appDiamond != address(0));
        appDiamond = _appDiamond;
    }
}