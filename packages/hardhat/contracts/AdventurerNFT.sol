// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import {IAdventurerNFT} from "./interfaces/IAdventurerNFT.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

abstract contract AdventurerNFT is IAdventurerNFT, ERC721URIStorage, ERC721Enumerable, Initializable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    address deployer;
    address public factory;
    string public objectId;
    bool public isPathway;
    string public parentId;

    constructor() {
        deployer = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(
        string memory _objectId,
        bool _isPathway,
        string memory _parentId
    ) external override initializer {
        //require(factory == address(0), 'dCompassNFT: FORBIDDEN'); // checks not called yet
        factory = msg.sender;
        objectId = objectId;
        isPathway = _isPathway;
        parentId = _parentId;
        /*name = string(
            abi.encodePacked("DCOMP-NFT-", _objectId)
        );
        symbol = string(
            abi.encodePacked("DCOMP-NFT-",_objectId)
        );*/
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Enumerable, ERC721) {
        super._beforeTokenTransfer(from,to,tokenId);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
    }
    
     function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721) returns (bool){
         return super.supportsInterface(interfaceId);
     }
     
     function tokenURI(uint256 tokenId) public view virtual override(ERC721URIStorage, ERC721) returns (string memory){
         return super.tokenURI(tokenId);
     }

}