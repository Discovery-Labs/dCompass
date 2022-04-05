// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/******************************************************************************\
* Author: Jamie Pickett
/******************************************************************************/

import "@openzeppelin/contracts/utils/Counters.sol";

library LibBadge {
    using Counters for Counters.Counter;
    
    bytes32 constant BADGE_STORAGE_POSITION = keccak256("dCompass.badge.storage.standard");

    struct BadgeStorage {
        address controller;
        Counters.Counter tokenIds;
        mapping(uint256 => mapping(address => uint256)) balances;
        mapping(address => mapping(address => bool)) operatorApprovals;
        
    }

    function badgeStorage()
        internal
        pure
        returns (BadgeStorage storage bs)
    {
        bytes32 position = BADGE_STORAGE_POSITION;
        assembly {
            bs.slot := position
        }
    }

    event ControlTransferred(
        address indexed previousController,
        address indexed newController
    );

    function setController(address newController) internal {
        BadgeStorage storage bs = badgeStorage();
        address previousController = bs.controller;
        bs.controller = newController;
        emit ControlTransferred(previousController, newController);
    }

    function enforceIsController() internal view {
        BadgeStorage storage bs = badgeStorage();
        require(msg.sender == bs.controller, "LibBadge: Must be controller");
    }
}