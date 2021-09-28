pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;


import './Ownable.sol';
//import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Signer is Ownable{
    //using ECDSA for bytes32;
   
   uint256 public nonce = 0;
   bytes32 public checkHash;
   bytes32 public finalHash;
   address public serverAddress;
  mapping (address => bool)  public serverAddresses;
  
  constructor(address _serverAddress) public {
      serverAddresses[_serverAddress] = true;
  }
  
  function getHash( uint256 _nonce, address _mintAddress, uint256 _toMint, string memory _did, string memory _questID) public returns (bytes32) {
      checkHash = keccak256(abi.encodePacked(address(this),_nonce,_mintAddress, _toMint, _did, _questID));
    return keccak256(abi.encodePacked(address(this),_nonce,_mintAddress, _toMint, _did, _questID));
  }
  
  function testHash(string memory _testString, address _testAddress, bytes32 r, bytes32 s, uint8 v) public {
      checkHash = keccak256(abi.encodePacked(_testString, _testAddress));
      bytes32 messageDigest = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", checkHash));
      finalHash = messageDigest;
      serverAddress = ecrecover(finalHash, v, r, s);
      
      
  }

  function metaSendValue( uint256 _toMint, string memory _did, string memory _questID, bytes32 r, bytes32 s, uint8 v) public {
    bytes32 hash = getHash(nonce, msg.sender, _toMint, _did, _questID);
    address signer = ecrecover(hash, v, r, s);
    require( serverAddresses[signer],"SIGNER MUST BE SERVER"); 
    nonce++;
    //Call NFT mint function(address, _did, _questID)
  }
    
}