// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IAdventureMetadata {
    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);
}