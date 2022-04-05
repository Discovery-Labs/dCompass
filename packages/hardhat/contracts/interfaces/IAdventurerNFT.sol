// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IAdventurerNFT {
    /**
     * @notice Function to initialize a new token
     * @dev Uses factory design pattern to create clones of base implementation
     * @param objectId The current objectId
     * @param isPathway is this pathway or badge/quest
     * @param parentId The parentId (pathwayId for badge and projectId for pathway)
     **/
    function initialize(
        string memory objectId,
        bool isPathway,
        string memory parentId
    ) external;

}
