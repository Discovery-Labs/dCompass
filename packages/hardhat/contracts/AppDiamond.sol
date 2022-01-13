// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AppDiamond is Ownable {
    address projectNFTAddr;//address that mints NFT after approval process to project
    address verifyAddr;//address that verifies deployments and updates
    mapping (address => bool) public reviewers;//same ones who can approve projectNFT
    uint128 public multiSigThreshold; //gives minimum multisig percentage (30 = 30% )
    uint128 public numReviewers;//number of Reviewers. Needed for threshold calculation
    mapping (string => bool) projApproved;//is Project NFt already approved and minted
    mapping (string => address) public projectDiamondAddrs; //mapping of address of deployed diamonds for 
    address public appSigningAddr;

    constructor(address _projectNFTAddr, address _verifyAddr, address _appSigningAddr){
        projectNFTAddr = _projectNFTAddr;
        verifyAddr = _verifyAddr;
        appSigningAddr = _appSigningAddr;
    }

    //eventually will need to make this multiSig, but onlyOwner for right now
    function setprojectNFTAddr(address _newNFTAddr) public onlyOwner{
        projectNFTAddr = _newNFTAddr;
    }

    function setApproved(string memory _projectId) external {
        require(_msgSender() == projectNFTAddr);
        projApproved[_projectId] = true;
    } 
      
    function deployDiamond(string memory _projectId, bool appSign, address projectSigningAddr, bytes32 r, bytes32 s, uint8 v) external {
        require(projectDiamondAddrs[_projectId] == address(0), "project had a diamond already");//for now immutable diamond
        require(projApproved[_projectId], "project NFT not minted");
        //call verify to make sure this is ok to deploy...
        //deploy diamond for project
    }


}