// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;


import "@openzeppelin/contracts/access/Ownable.sol";
//import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Verify is Ownable{
    //using ECDSA for bytes32;
   
   mapping (address => uint) public nonces;
   bytes32 public checkHash;
   bytes32 public finalHash;
   address public serverAddress;
  mapping (address => bool)  public serverAddresses;
  mapping (address => bool) public approvers;
  
  constructor(address _serverAddress) public {
      serverAddresses[_serverAddress] = true;
  }
  
  function getHash(address _mintAddress, uint256 _toMint, string memory _did, string memory _questID) public returns (bytes32) {
      checkHash = keccak256(abi.encodePacked(nonces[_mintAddress],_mintAddress, _toMint, _did, address(this), _questID));
    return keccak256(abi.encodePacked(address(this),nonces[_mintAddress],_mintAddress, _toMint, _did, address(this), _questID));
  }
  
  function testHash(string memory _testString, address _testAddress, bytes32 r, bytes32 s, uint8 v) public {
      checkHash = keccak256(abi.encodePacked(_testString, _testAddress));
      bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", checkHash));
      finalHash = messageDigest;
      serverAddress = ecrecover(finalHash, v, r, s);   
  }

  function metaDataVerify(address _mintAddress, uint256 _randomNumber, string memory _did, string memory _questID, bytes32 r, bytes32 s, uint8 v) public returns(bool) {
    bytes32 hashRecover = getHash(_mintAddress, _randomNumber, _did, _questID);
    address signer = ecrecover(keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hashRecover)), v, r, s);
    require( serverAddresses[signer],"SIGNER MUST BE SERVER"); 
    nonces[msg.sender]++;
    return true;
    //Call NFT mint function(address, _did, _questID)
  }
    
}