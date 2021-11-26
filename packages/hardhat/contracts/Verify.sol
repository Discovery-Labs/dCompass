// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


import "@openzeppelin/contracts/access/Ownable.sol";
//import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Verify is Ownable{
    //using ECDSA for bytes32;
   
  mapping (address => uint) public nonces;//nonce for each NFT contract
  mapping (string => uint) public noncesById;//nonce for each parentId (e.g. projectId for course and Course Id for quest)
  mapping (string => uint) public thresholdNoncesById;//nonce for each parentId Threshold (e.g. projectId for course and Course Id for quest)
  address public serverAddress;
  //mapping (address => bool)  public serverAddresses;
  mapping (address => bool) public approvers;
  
  constructor(address _serverAddress, address[] memory _approvers){
      //serverAddresses[_serverAddress] = true;
      require(_serverAddress != address(0));
      serverAddress = _serverAddress;
      for (uint i=0; i< _approvers.length; i++){
        approvers[_approvers[i]] = true;
      }
  }
  
  function getHash(address _senderAddress, string memory _objectId, string memory _parentId, address _contractAddress) internal view returns (bytes32) {
    return keccak256(abi.encodePacked(nonces[_senderAddress], noncesById[_parentId], _senderAddress, _contractAddress, address(this), _objectId));
  }

  function metaDataVerify(address _senderAddress, string memory _objectId, string memory _parentId, bytes32 r, bytes32 s, uint8 v) public returns(bool) {
    bytes32 hashRecover = getHash(_senderAddress, _objectId, _parentId, _msgSender());
    address signer = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",hashRecover)), v, r, s);
    require( signer == serverAddress,"SIGNER MUST BE SERVER"); 
    nonces[msg.sender]++;
    noncesById[_objectId]++;
    return signer == serverAddress;
    //Call NFT mint function(address, _did, _questID)
  }

  function thresholdVerify(address _senderAddress, string memory _objectId, uint votesNeeded, bytes32 r, bytes32 s, uint8 v) public returns(bool){
    bytes32 hashRecover = keccak256(abi.encodePacked(thresholdNoncesById[_objectId], votesNeeded, _senderAddress, _msgSender(), address(this), _objectId));
    address signer = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",hashRecover)), v, r, s);
    require( signer == serverAddress,"SIGNER MUST BE SERVER"); 
    thresholdNoncesById[_objectId]++;
    return signer == serverAddress;
  }

  function setServerAddress(address _newAddress) public{
    require(approvers[_msgSender()], "must be approved");
    require(_newAddress != address(0));
    serverAddress = _newAddress;
  }
    
}