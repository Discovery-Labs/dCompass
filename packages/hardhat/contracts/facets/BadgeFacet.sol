// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassBadgeFacet ERC1155 implementation
 * @dev NFTs for creating badges
*/

import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
//import { IERC1155 } from "../interfaces/IERC1155.sol";
//import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import { ERC1155BaseInternal } from "../base/ERC1155BaseInternal.sol";
import { LibBadge } from "../libraries/LibBadge.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";




abstract contract BadgeFacet is IERC1155, ERC1155BaseInternal{
    
    function mint(address _minter, string memory _badgeId, string memory _projectId, string memory _pathwayId, bytes32 r, bytes32 s, uint8 v) external returns(bool){
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        require(keccak256(abi.encodePacked(ds.projectId)) == keccak256(abi.encodePacked(_projectId)), "ERC1155 : wrong projectId");
        require(ds.validPathways[_pathwayId], "ERC1155 : invalid pathway for project");
        require(keccak256(abi.encodePacked(ds.questParent[_badgeId])) == keccak256(abi.encodePacked(_pathwayId)), "ERC1155 : quest not contained in pathway");
        return true;
    }

    /**
     * @inheritdoc IERC1155
     */
    function balanceOf(address account, uint256 id)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _balanceOf(account, id);
    }

    /**
     * @inheritdoc IERC1155
     */
    function balanceOfBatch(address[] memory accounts, uint256[] memory ids)
        public
        view
        virtual
        override
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            'ERC1155: accounts and ids length mismatch'
        );

        mapping(uint256 => mapping(address => uint256))
            storage balances = LibBadge.badgeStorage().balances;

        uint256[] memory batchBalances = new uint256[](accounts.length);

        unchecked {
            for (uint256 i; i < accounts.length; i++) {
                require(
                    accounts[i] != address(0),
                    'ERC1155: batch balance query for the zero address'
                );
                batchBalances[i] = balances[ids[i]][accounts[i]];
            }
        }

        return batchBalances;
    }

    /**
     * @inheritdoc IERC1155
     */
    function isApprovedForAll(address account, address operator)
        public
        view
        virtual
        override
        returns (bool)
    {
        return LibBadge.badgeStorage().operatorApprovals[account][operator];
    }

    /**
     * @inheritdoc IERC1155
     */
    function setApprovalForAll(address operator, bool status) public virtual override {
        require(
            msg.sender != operator,
            'ERC1155: setting approval status for self'
        );
        LibBadge.badgeStorage().operatorApprovals[msg.sender][
            operator
        ] = status;
        emit ApprovalForAll(msg.sender, operator, status);
    }

    /**
     * @inheritdoc IERC1155
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            'ERC1155: caller is not owner nor approved'
        );
        _safeTransfer(msg.sender, from, to, id, amount, data);
    }

    /**
     * @inheritdoc IERC1155
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(
            from == msg.sender || isApprovedForAll(from, msg.sender),
            'ERC1155: caller is not owner nor approved'
        );
        _safeTransferBatch(msg.sender, from, to, ids, amounts, data);
    }

    
}