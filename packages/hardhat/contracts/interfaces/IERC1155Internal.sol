// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import { IERC165 } from '@openzeppelin/contracts/utils/introspection/IERC165.sol';

/**
 * @notice Partial ERC1155 interface needed by internal functions
 */
interface IERC1155Internal {
    event InternalTransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    event InternalTransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    event InternalApprovalForAll(
        address indexed account,
        address indexed operator,
        bool approved
    );
}