// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title NFTAux
 * @dev auxiliary contract to reduce some of the size and redundancy of the main NFT contracts 
*/

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract NFTAux {
    address projectNFTAddr;
    address pathwayNFTAddr;
    address badgeNFTAddr;
    address verifyAddr;

    constructor(address _projectNFTAddr, address _pathwayNFTAddr, address _badgeNFTAddr, address _verifyAddr){

    }
}