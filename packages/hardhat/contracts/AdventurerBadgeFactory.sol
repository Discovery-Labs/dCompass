// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassBadgeNFT
 * @dev NFTs for creating badges
*/

import "@openzeppelin/contracts/proxy/Clones.sol";
import "./interfaces/IAdventurerBadgeFactory.sol";
import "./interfaces/IAdventurerNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AdventurerBadgeFactory is IAdventurerBadgeFactory, Ownable {
    address public dCompERC721TokenImplementation;
    address public projectNFTAddress;
    address public pathwayNFTAddress;
    address public badgeNFTAddress;
    address public appDiamond;
    enum ObjectType{Pathway, Badge}

    
    //string objectId =>  ObjectType
    mapping (string => ObjectType) public getType;
    mapping (uint => string) public typeStrings;
    mapping (string => string) public parentIdPerObjectId;
    mapping (string => address) public getNFTAddrs;
    mapping (address => mapping (uint => string)) public userBadgesByIndex;//get user badge per quest/pathwayId with known index
    mapping (address => uint) public userBadgeNumber;//get number of user badges 

    address[] internal allAddrs;

    constructor(
        address _dCompERC721TokenImplementation,
        address _projectNFTAddress,
        address _pathwayNFTAddress,
        address _badgeNFTAddress,
        address _appDiamond
    ) {
        dCompERC721TokenImplementation = _dCompERC721TokenImplementation;
        address projectNFTAddress = _projectNFTAddress;
        address pathwayNFTAddress = _pathwayNFTAddress;
        address badgeNFTAddress = _badgeNFTAddress;
        address appDiamond = _appDiamond;
        typeStrings[0] = "Pathway";
        typeStrings[1] = "Badge";
    }

    function allAddrsLength() external view returns (uint256) {
        return allAddrs.length;
    }

    function getAllAddrs() external view returns (address[] memory){
        return allAddrs;
    }

    function getAllUserBadges(address user) external view returns(string memory){
        uint numBadges = userBadgeNumber[user];
        require(numBadges > 0, "no badges");
        uint index = 1;
        string memory ret;
        while(index <= numBadges){
            ret = string(abi.encodePacked(ret, "__", userBadgesByIndex[user][index]));
            index++;
        }
        return ret;
    }

    function createNFTToken(
        string memory objectId,
        bool isPathway,
        string memory parentId
    ) external override returns (address newToken) {
        require(
            getNFTAddrs[objectId] ==
                address(0),
            "dCompFactory: TOKEN_EXISTS"
        );
        
        bytes32 salt =
            keccak256(
                abi.encodePacked(
                    objectId,
                    isPathway,
                    parentId
                )
            );
        if(isPathway){
            getType[objectId] = ObjectType.Pathway;
        }
        else{
            getType[objectId] = ObjectType.Badge;
        }
        newToken = Clones.cloneDeterministic(dCompERC721TokenImplementation, salt);
        IAdventurerNFT(newToken).initialize(
            objectId,
            isPathway,
            parentId
        );
        
        getNFTAddrs[objectId] = newToken;
        allAddrs.push(newToken);
    }

}
