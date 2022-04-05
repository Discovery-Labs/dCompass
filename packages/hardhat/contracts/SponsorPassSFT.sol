// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title dCompassSponsorSFT
 * @dev SFTs for tracking dCompass sponsors
*/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract SponsorPassSFT is ERC1155 {
    uint256 public constant SILVER = 1;
    uint256 public constant GOLD = 2;
    uint256 public constant DIAMOND = 3;
    mapping (uint => uint) public stakeAmounts;
    address payable projectNFTAddr;//project NFT Address this will interact with
    mapping (string => uint) levelByProject;//level of each project...needed in case a wallet, so can read level by project
    //mapping (address => uint) public isAddrOwner;//is address associated with project owner?
    mapping (string => address) public walletByProj;//wallet address for a project
    mapping (address => string) public projByWallet;//wallet which is project wallet

    constructor(uint[] memory _initStakeAmounts, address payable _projectNFTAddr)
        ERC1155(
            "https://bafybeifeu5j5a52n6oslqdvkyskuhtehaqxkjiw5lbpnia6fakpwlkgz2y.ipfs.dweb.link/{id}.json"
        ) {
            for (uint i =0; i < DIAMOND; i++){
                stakeAmounts[i+1] = _initStakeAmounts[i];
            }
            projectNFTAddr = _projectNFTAddr;
        }

    function mint(uint _id, address _to, string memory projectId) external {
        require(msg.sender == projectNFTAddr, "invalid contract calling mint");
        //require(!isAddrOwner[_to], "address currently has active token");
        //isAddrOwner[_to] += true;
        walletByProj[projectId] = _to;
        //projByWallet[_to] = projectId;
        levelByProject[projectId] = _id;
        _mint(_to, _id, 1, "");
    }

    function updateLevel(uint _id, address _from, string memory projectId, uint newLevel) external {
        //burn one NFT from current level and mint one from another level
        require(msg.sender == projectNFTAddr, "invalid contract calling mint");
        //require(isAddrOwner[_from], "no token to burn");
        require(_from == walletByProj[projectId], "not wallet associated with project");
        //require(keccak256(abi.encodePacked(projByWallet[_from]))==keccak256(abi.encodePacked(projectId)), "not current owner associated with project");
        _burn(_from,_id,1);
        levelByProject[projectId] = newLevel;
        _mint(_from, newLevel, 1, "");

    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: caller is not owner nor approved"
        );
        //require(isAddrOwner[from] && !isAddrOwner[to], "ERC1155: from or to have incorrect ownership");
        string memory _projectId = abi.decode(data, (string));
        require (walletByProj[_projectId] == from, "ERC1155: from is not project wallet");
        require (levelByProject[_projectId] == id, "ERC1155: incorrect level for project");
        _safeTransferFrom(from, to, id, amount, data);
        (bool success,) = projectNFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("changeProjectWallet(string,address)")), _projectId, to));
        require(success, "unsuccessful projectNFT call");
        walletByProj[_projectId] = to;
        /*projByWallet[to] = projByWallet[from];
        delete projByWallet[from];
        delete isAddrOwner[from];
        isAddrOwner[to] = true;*/
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(false, "ERC1155: locking batch Transfers");
    }

    function setStakeAmounts(uint _tokenId, uint amount) external {
        (bool success, bytes memory data) = projectNFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("reviewers(address)")), msg.sender));
        require(success, "unsuccessful projectNFT call");
        bool isReviewer = abi.decode(data, (bool));
        require(isReviewer, "not approved app reviewer");
        require (_tokenId >0 && _tokenId < DIAMOND + 1, "invalid _tokenId");
        stakeAmounts[_tokenId] = amount;
    }
}