// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import {IAdventurerNFT} from "./interfaces/IAdventurerNFT.sol";
import {IAdventureMetadata} from "./interfaces/IAdventureMetadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract AdventurerNFT is IAdventurerNFT, IAdventureMetadata, ERC721URIStorage, ERC721Enumerable, Initializable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIds;
    
    address deployer;
    address public factory;
    string public objectId;
    bool public isPathway;
    string public parentId;

    constructor() ERC721("dCompassNFT", "DCOMPNFT"){
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
    }

    function name() public override(ERC721, IAdventureMetadata) view returns(string memory){
        string memory baseName = super.name();
        return string(abi.encodePacked(baseName, "-", objectId));
    }  

    function symbol() public override(ERC721, IAdventureMetadata) view returns(string memory){
        string memory baseSymbol = super.symbol();
        return string(abi.encodePacked(baseSymbol, "-", objectId));
    }

    function mint(address _to, uint256 count, string memory _tokenURI) external returns (uint256 newTokenId){
        bool success;
        bytes memory data;
        address senderCheck;
        if(isPathway){
            (success, data) = factory.call(abi.encodeWithSelector(bytes4(keccak256("pathwayNFTAddress()"))));
            require(success);
            senderCheck = abi.decode(data, (address));
        }
        else{
            (success, data) = factory.call(abi.encodeWithSelector(bytes4(keccak256("badgeNFTAddress()"))));
            require(success);
            senderCheck = abi.decode(data, (address));
        }
        require(msg.sender == senderCheck, "AdventurerNFT : incorrect mint address");

        //just in case different "versions" of pathways or quests drop without a new NFT
        require(balanceOf(_to) + 1 == count, "AdventureNFT : not allowed to mint again");
        _tokenIds.increment();
        newTokenId = _tokenIds.current();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
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