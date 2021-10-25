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
import "./RandomNumberConsumer.sol";



contract CourseNFT is ERC721URIStorage, Ownable{
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;

    RandomNumberConsumer vrfContract;//VRF Contract used for randomness
    mapping (string => uint16[]) public rarities; // rarities of each image uint16 used for packing purposes

    constructor(address _vrfAddress)ERC721("dCompassCourse", "DCOMC"){
        vrfContract = RandomNumberConsumer(_vrfAddress);
    }

}