// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract RandomNumberConsumer is VRFConsumerBase, Ownable {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    
    mapping(bytes32 => string) public objectRequests;//requestId to objectId (object is course or quest)
    mapping(bytes32 => uint) public numContributors;//requestId to num of contirbutors at time of approval
    mapping(string => uint8[]) internal objectRarities;//calculated rarities for course or quest
    mapping(string => uint256) public blockNumberResults;//block number request was fulfilled at
    mapping (string => uint256) public requestResults;
    mapping (address => bool) whiteList;//approved contracts and users that can call this will eventually be multi-sig holders

    event RandomNumberFulfilled(string indexed _projectId);

    modifier onlyWhiteList(){
        require(whiteList[_msgSender()], "not authorized");
        _;
    }
    
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address [] memory _reviewers) 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        )
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
        for (uint i=0; i<_reviewers.length; i++){
            if(_reviewers[i]!= address(0) && !whiteList[_reviewers[i]]){
                whiteList[_reviewers[i]] = true;  
            }
        }
    }
    
    /** 
     * Requests randomness 
     */
    function getRandomNumber(string memory _objectId, uint _numContributors) public onlyWhiteList returns (bytes32 requestId){
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        requestId = requestRandomness(keyHash, fee);
        objectRequests[requestId] = _objectId;
        numContributors[requestId] = _numContributors;
        return requestId;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        string memory objectId = objectRequests[requestId];
        requestResults[objectId] = randomness;
        blockNumberResults[objectId] = block.number;
        uint currentIndex = 0;
        uint8[] memory rarities = new uint8[](numContributors[requestId]);

        while(currentIndex < rarities.length){
            rarities[currentIndex] = uint8((uint256(keccak256(abi.encode(randomness, currentIndex))) % 100) + 1);
            currentIndex++;
        }

        objectRarities[objectId] = rarities;
        emit RandomNumberFulfilled(objectId);
    }
    
    function addContractToWhiteList(address _newWhiteList) public onlyWhiteList{
        require(!whiteList[_newWhiteList], "already approved");
        whiteList[_newWhiteList] = true;
    }
    
    function getObjectRarities(string memory _objectId) public view returns(uint8[] memory){
        return objectRarities[_objectId];
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}