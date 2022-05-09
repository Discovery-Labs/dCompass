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
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ProjectNFT is ERC721URIStorage, Ownable, ReentrancyGuard{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    Counters.Counter private _multiSigRequest;
    
    //uint public stakeAmount = 0.001 ether;
    mapping (address => bool) public reviewers;
    uint128 public multiSigThreshold; //gives minimum multisig percentage (30 = 30% )
    uint128 public numReviewers;//number of Reviewers. Needed for threshold calculation
    address payable public appWallet;//sign in a script and also withdraw slashed stakes
    address payable appDiamond;//address of the app level diamond
    address payable sponsorSFTAddr;//address of ERC-1155 that controls sponsor staking
    enum ProjectStatus{ NONEXISTENT, PENDING, DENIED, APPROVED }
    
    mapping (string => address[]) internal contributors;
    //mapping (string => address[]) internal approvedERC20Addrs;
    mapping (string => address) public projectWallets;
    mapping (string => uint) public stakePerProject;
    mapping (string => uint) public refundPerProject;
    mapping (string => uint) public sponsorLevel;
    mapping (string => uint) sponsorLevels;
    mapping (uint => string) public statusStrings;
    mapping (string => ProjectStatus) public status;
    mapping (string => uint) public votes;//tally of approved votes;
    mapping (string => uint) public votesReject;//tally of rejection votes;
    mapping (string => mapping(address => bool)) public reviewerVotes;//vote record of reviewers for ProjectId
    //mapping (string => uint16[]) public rarities; // rarities of each image uint16 used for pakcing purposes
    mapping (string => bool) public projectMinted; // tracks if mint has been done
    mapping (string => uint) public projectThresholds;// threshold for the project contributors to approve courses
    
    event NFTProjectMinted(address indexed _to, string indexed _tokenURI, string indexed _questId);
    event ReceiveCalled(address _caller, uint _value);
    event ProjectApproved(string indexed _projectId);

    constructor(address payable _walletAddress, address[] memory _reviewers, uint128 _initialThreshold) ERC721("dCompassProject", "DCOMPROJ"){
        require(_reviewers.length > 0, "Must have at least 1 reviewer");
        require(_initialThreshold > 0 && _initialThreshold <=100, "invalid threshold");
        multiSigThreshold = _initialThreshold;
        appWallet = _walletAddress;
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
        sponsorLevels["SILVER"] = 1;
        sponsorLevels["GOLD"] = 2;
        sponsorLevels["DIAMOND"] = 3;
    } 

    modifier onlyReviewer(){
        require(reviewers[_msgSender()], "not a reviewer");
        _;
    }

    receive() external payable {
        emit ReceiveCalled(msg.sender, msg.value);
    }
    
    function voteForApproval(address[] memory _contributors, uint _threshold, string memory _projectId) public onlyReviewer{
        require(
            status[_projectId] == ProjectStatus.PENDING,
            "status not pending"
        );
        require(!reviewerVotes[_projectId][_msgSender()], "already voted for this project");
        require (projectWallets[_projectId] != address(0), "no project wallet");
        votes[_projectId]++;
        reviewerVotes[_projectId][_msgSender()] = true;
        if(votes[_projectId] == 1){
            require(_contributors.length >0, "empty array");
            require(_threshold > 0 && _threshold <= 100, "invalid threshold");
            //rarities[_projectId] = _rarities;
            contributors[_projectId] = _contributors;
            projectThresholds[_projectId] = _threshold;
            //approvedERC20Addrs[_projectId] = approvedAddrs;
            if(multiSigThreshold*numReviewers/100 == 0){
                status[_projectId] = ProjectStatus.APPROVED;
                (bool success,) = appWallet.call{value : stakePerProject[_projectId]}("");
                require(success, "transfer failed");
                emit ProjectApproved(_projectId);
                //approveMint(_projectId);
            }
        }
        else{
            uint minVotes = multiSigThreshold*numReviewers/100;
            if(minVotes * 100 < multiSigThreshold*numReviewers){
                minVotes++;
            }
            if(votes[_projectId] >= minVotes){
                status[_projectId] = ProjectStatus.APPROVED;
                (bool success,) = appWallet.call{value : stakePerProject[_projectId]}("");
                require(success, "transfer failed");
                emit ProjectApproved(_projectId);
                //approveMint(_projectId);
            }  
        }
    }

    function voteForRejection(string memory _projectId) public onlyReviewer{
        require(status[_projectId] == ProjectStatus.PENDING, "project not pending");
        require(!reviewerVotes[_projectId][_msgSender()], "already voted for this project");
        votesReject[_projectId]++;
        reviewerVotes[_projectId][_msgSender()] = true;
        uint minVotes = multiSigThreshold*numReviewers/100;
        if(minVotes * 100 < multiSigThreshold*numReviewers){
            minVotes++;
        }
        if(votesReject[_projectId] >= minVotes){
            status[_projectId] = ProjectStatus.DENIED;
            (bool success,) = payable(projectWallets[_projectId]).call{value : stakePerProject[_projectId]}("");
            require(success, "transfer failed");
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
        
        emit NFTProjectMinted(contributors[_projectId][i], _tokenURI, _projectId);
        }
        //set the approval within app Diamond contract
        (bool success, ) = appDiamond.call(abi.encodeWithSelector(bytes4(keccak256("setApproved(string)")), _projectId));
        require(success, "diamond approval failed");

        //mint SFT here
        (success,) = sponsorSFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("mint(uint256,address,string)")), sponsorLevel[_projectId], projectWallets[_projectId], _projectId));
        require(success, "sponsor mint failed");

        projectMinted[_projectId] = true;
        return newItems;    
    }

    function addProjectWallet(string memory _projectId, address _projectWallet, string memory level) external payable{
        require (projectWallets[_projectId] == address(0), "already project wallet");
        //require(status[_projectId] == ProjectStatus.NONEXISTENT);
        uint pendingSponsorLevel = sponsorLevels[level];
        require (pendingSponsorLevel > 0, "invalid sponsor stake");
        (bool success, bytes memory data) = sponsorSFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("stakeAmounts(uint256)")), pendingSponsorLevel));
        require(success);
        uint stakeAmount = abi.decode(data, (uint256)); 
        require (msg.value >= stakeAmount, "not enough staked");
        /*(success, data) = sponsorSFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("isAddrOwner(address)")), _projectWallet));
        require(success);
        bool isActive = abi.decode(data, (bool));
        require(!isActive, "address already linked with active project");*/
        projectWallets[_projectId] = _projectWallet;
        stakePerProject[_projectId] = stakeAmount;
        sponsorLevel[_projectId] = pendingSponsorLevel;
        status[_projectId]= ProjectStatus.PENDING;
        if(msg.value > stakeAmount){
            (success, ) = payable(_msgSender()).call{value : msg.value - stakeAmount}("");
            require(success, "failed refund");
        }
    }

    function changeProjectWallet(string memory _projectId, address newAddr) external {
        require(_msgSender() == sponsorSFTAddr, "ProjectNFT: wrong caller");
        require (projectWallets[_projectId] != address(0), "no project wallet");
        projectWallets[_projectId] = newAddr;
    }

    function projectRefund(string memory _projectId) external payable{
        require(status[_projectId] == ProjectStatus.PENDING || status[_projectId] == ProjectStatus.APPROVED, "incorrect status");
        require(_msgSender() == appWallet, "wrong sender");//multiSig Wallet of app
        refundPerProject[_projectId] += msg.value;
    }

    function updateSponsorLevel(string memory _projectId, string memory newLevel) external payable nonReentrant {
        require(status[_projectId] == ProjectStatus.PENDING || status[_projectId] == ProjectStatus.APPROVED, "incorrect status");
        require(_msgSender() == projectWallets[_projectId], "wrong sender");
        uint newSponsorLevel = sponsorLevels[newLevel];
        require (newSponsorLevel > 0, "invalid level");
        (bool success, bytes memory data) = sponsorSFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("stakeAmounts(uint256)")), newSponsorLevel));
        require(success);
        uint stakeAmount = abi.decode(data, (uint256));
        uint pastAmount = stakePerProject[_projectId];
        uint currLevel = sponsorLevel[_projectId];
        if(currLevel == newSponsorLevel){
            if(status[_projectId] == ProjectStatus.PENDING){
                if(stakeAmount < pastAmount){
                    stakePerProject[_projectId] = stakeAmount;
                    (success, ) = payable(_msgSender()).call{value : pastAmount - stakeAmount}("");
                    require(success, "failed refund");
                    
                }
            }
            else{
                stakePerProject[_projectId] = stakeAmount;
                uint256 refund = refundPerProject[_projectId];
                delete refundPerProject[_projectId];
                (success, ) = payable(_msgSender()).call{value : refund}("");
                require(success, "failed refund");                
                }
            return;
        }
        stakePerProject[_projectId] = stakeAmount;
        sponsorLevel[_projectId] = newSponsorLevel;
        if (stakeAmount <= pastAmount){
            if(status[_projectId] == ProjectStatus.PENDING){
                (success, ) = payable(_msgSender()).call{value : pastAmount - stakeAmount}("");
                require(success, "failed refund");
                
            }
            else{
                uint256 refund = refundPerProject[_projectId];
                delete refundPerProject[_projectId];
                (success, ) = payable(_msgSender()).call{value : refund}("");
                require(success, "failed refund");
            }
        }
        else{
            require(msg.value >= stakeAmount - pastAmount, "insufficent funds for new level");
            if(msg.value > stakeAmount - pastAmount){
            (success, ) = payable(_msgSender()).call{value : msg.value + pastAmount - stakeAmount}("");
            require(success, "failed refund");
            }
        }
        if(projectMinted[_projectId]){
            (success, data) = sponsorSFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("updateLevel(uint256,address,string,uint256)")), currLevel, projectWallets[_projectId], _projectId, newSponsorLevel));
            require(success);
        }
        // stakePerProject[_projectId] = stakeAmount;
        // sponsorLevel[_projectId] = newSponsorLevel;
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
        address[] memory currContributors = contributors[_projectId];
        for(uint i=0; i<currContributors.length; i++){
            if(!isAllowed && _msgSender() == currContributors[i]){
                isAllowed = true;
            }
            if(newContributor == currContributors[i]){
                notContributor = false;
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

    function getAppDiamond() external view returns(address){
        return appDiamond;
    }

    function setSFTAddr(address payable _SFTAddr) external onlyReviewer{
        require(_SFTAddr != address(0));
        sponsorSFTAddr = _SFTAddr;
    }

    function getSFTAddr() external view returns(address){
        return sponsorSFTAddr;
    }

}