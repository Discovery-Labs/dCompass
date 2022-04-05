// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import { ProjectDiamond } from "./ProjectDiamond.sol";

contract AppDiamond is Ownable {
    address projectNFTAddr;//address that mints NFT after approval process to project
    address verifyAddr;//address that verifies deployments and updates
    address pathwayNFTAddr;//address mints Pathway NFTs
    mapping (address => bool) public reviewers;//same ones who can approve projectNFT
    uint128 public multiSigThreshold; //gives minimum multisig percentage (30 = 30% )
    uint128 public numReviewers;//number of Reviewers. Needed for threshold calculation
    mapping (string => bool) public projApproved;//is Project NFt already approved and minted
    mapping (string => address) public projectDiamondAddrs; //mapping of address of deployed diamonds for 
    address public appSigningAddr;
    address sponsorSFT;//ERC1155 for sponsors
    mapping (uint => address[]) internal approvedERC20sPerChain;//approved ERC20s per Chain only use when calculating all the refunds for a pathway
    mapping (uint => mapping (address => bool)) public isERC20ApprovedOnChainId;//check if this is an approved ERC20
    mapping (string => mapping (uint => address[])) internal projectApprovedERC20sPerChain;//approved ERC20s per project per chain
    mapping (string => mapping (uint => mapping (address => bool))) public isProjectERC20ApprovedOnChainId;//check if this is an approved ERC20 for project

    constructor(address _projectNFTAddr, address _pathwayNFTAddr, address _verifyAddr, address _sponsorSFT, address _appSigningAddr){
        projectNFTAddr = _projectNFTAddr;
        pathwayNFTAddr = _pathwayNFTAddr;
        verifyAddr = _verifyAddr;
        appSigningAddr = _appSigningAddr;
        sponsorSFT = _sponsorSFT;
    }

    receive() external payable {}

    //eventually will need to make this multiSig, but onlyOwner for right now
    function setprojectNFTAddr(address _newNFTAddr) public onlyOwner{
        projectNFTAddr = _newNFTAddr;
    }

    function setApproved(string memory _projectId) external {
        require(_msgSender() == projectNFTAddr);
        projApproved[_projectId] = true;
    } 
      
    function deployDiamond(string memory _projectId, bool appSign, address projectSigningAddr, address _diamondCutFacet, bytes32 r, bytes32 s, uint8 v) external {
        (bool success, bytes memory data) = projectNFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("reviewers(address)")), _msgSender()));
        require(success, "unsuccessful call");
        success = abi.decode(data, (bool));
        require(success, "not approved app reviewer");
        require(projectDiamondAddrs[_projectId] == address(0), "project had a diamond already");//for now immutable diamond could change later
        require(projApproved[_projectId], "project NFT not minted");
        //call verify to make sure this is ok to deploy
        (success, data) = verifyAddr.call(abi.encodeWithSelector(bytes4(keccak256("deployDiamondVerify(address,string,bytes32,bytes32,bytes32)")), 
                _msgSender(),
                _projectId,
                r,
                s,
                v
            ));
        require(success, "unsuccessful call");
        success = abi.decode(data, (bool));
        require(success, "AppDiamond : not approved deploy");
        
        //deploy diamond for project

        ProjectDiamond p = new ProjectDiamond(owner(), _diamondCutFacet, appSign, projectSigningAddr, projectNFTAddr, pathwayNFTAddr, _projectId);
        projectDiamondAddrs[_projectId] = address(p);
    }

    //impossible for now to take off approved ERC20 Addrs, but can add new ones to mapping
    function addERC20PerChain(uint chainId, address[] memory  _ERC20Addrs) external onlyOwner{
        require(chainId > 0 && _ERC20Addrs.length > 0, "invalid entry");
        approvedERC20sPerChain[chainId] = _ERC20Addrs;
        for(uint i=0; i< _ERC20Addrs.length; i++){
           isERC20ApprovedOnChainId[chainId][_ERC20Addrs[i]] = true; 
        }
    }

    function getERC20Addrs(uint chainId) external view returns(address[] memory){
        return approvedERC20sPerChain[chainId];
    }

    function getERC20AddrsPerProject(string memory projectId, uint chainId) external view returns(address[] memory){
        return projectApprovedERC20sPerChain[projectId][chainId];
    }

    function checkApprovedERC20PerProjectByChain(string memory projectId, uint256 chainId, address ERC20Addr) external view returns(bool){
        return (isERC20ApprovedOnChainId[chainId][ERC20Addr] || isProjectERC20ApprovedOnChainId[projectId][chainId][ERC20Addr]);
    }

    function addProjectERC20PerChain(string memory projectId, uint[] memory chainIds, address[][] memory ERC20Addrs) external {
        (bool success, bytes memory data) = projectNFTAddr.call(abi.encodeWithSelector(bytes4(keccak256("reviewers(address)")), _msgSender()));
        require(success, "unsuccessful call");
        bool isReviewer = abi.decode(data, (bool));
        require(isReviewer, "not approved app reviewer");
        require(chainIds.length > 0 && chainIds.length == ERC20Addrs.length, "invalid lengths sent");
        uint j;
        for(uint i=0; i<chainIds.length; i++){
            projectApprovedERC20sPerChain[projectId][chainIds[i]] = ERC20Addrs[i];
            for(j=0; j< ERC20Addrs[i].length; j++){
                isProjectERC20ApprovedOnChainId[projectId][chainIds[i]][ERC20Addrs[i][j]]=true;
            }
        }
    }
}