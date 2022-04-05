// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IAdventurerBadgeFactory {
    
    function createNFTToken(
        string memory objectId,
        bool isPathway,
        string memory parentId
    ) external returns (address newToken);

}
