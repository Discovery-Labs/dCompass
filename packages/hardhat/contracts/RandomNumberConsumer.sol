// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract RandomNumberConsumer is VRFConsumerBase, Ownable {
    
    bytes32 internal keyHash;
    uint256 internal fee;
    
    mapping(bytes32 => string) public objectRequests;//requestId to objectId (object is course or quest)
    mapping(string => uint256) public blockNumberResults;//block number request was fulfilled at
    mapping (string => uint256) public requestResults;
    mapping (address => bool) whiteList;//approved contracts and users that can call this will eventually be multi-sig holders

    event RandomNumberFulilled(string indexed _projectId);

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
    constructor() 
        VRFConsumerBase(
            0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9, // VRF Coordinator
            0xa36085F69e2889c224210F603D836748e7dC0088  // LINK Token
        ) public
    {
        keyHash = 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4;
        fee = 0.1 * 10 ** 18; // 0.1 LINK (Varies by network)
    }
    
    /** 
     * Requests randomness 
     */


    function getRandomNumber(string memory _objectId) public onlyWhiteList returns (bytes32 requestId){
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        requestId = requestRandomness(keyHash, fee);
        objectRequests[requestId] = _objectId;
        return requestId;
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        string memory objectId = objectRequests[requestId];
        requestResults[objectId] = randomness;
        blockNumberResults[objectId] = block.number;
        emit RandomNumberFulilled(objectId);
    }
    
    function addContractToWhiteList(address _newWhiteList) public onlyWhiteList{
        require(!whiteList[_newWhiteList], "already approved");
        whiteList[_newWhiteList] = true;
    }

    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}