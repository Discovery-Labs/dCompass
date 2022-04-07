// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";

//import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract Verify is Ownable {
    //using ECDSA for bytes32;

    mapping(string => mapping(string => uint256)) public noncesParentIdChildId; //nonce for each parentId and childId (e.g. projectId and  courseId or CourseId and questId)
    mapping(string => uint256) public thresholdNoncesById; //nonce for each parentId Threshold (e.g. projectId for course and Course Id for quest)
    mapping(string => uint256) public deployNoncesById; //nonce for each projectId deploy of a diamond
    address public serverAddress;
    mapping(address => bool) public approvers;

    constructor(address _serverAddress, address[] memory _approvers) {
        require(_serverAddress != address(0));
        serverAddress = _serverAddress;
        for (uint256 i = 0; i < _approvers.length; i++) {
            approvers[_approvers[i]] = true;
        }
    }

    function getHash(
        address _senderAddress,
        string memory _objectId,
        string memory _parentId,
        address _contractAddress
    ) internal view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    noncesParentIdChildId[_parentId][_objectId],
                    _senderAddress,
                    _contractAddress,
                    address(this),
                    _objectId
                )
            );
    }

    function metaDataVerify(
        address _senderAddress,
        string memory _objectId,
        string memory _parentId,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public returns (bool) {
        bytes32 hashRecover = getHash(
            _senderAddress,
            _objectId,
            _parentId,
            _msgSender()
        );
        address signer = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    hashRecover
                )
            ),
            v,
            r,
            s
        );
        require(
            signer == serverAddress,
            "SIGNER MUST BE SERVER in metaDataVerify"
        );
        noncesParentIdChildId[_parentId][_objectId]++;
        return signer == serverAddress;
    }

    function thresholdVerify(
        address _senderAddress,
        string memory _objectId,
        uint256 votesNeeded,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public returns (bool) {
        bytes32 hashRecover = keccak256(
            abi.encodePacked(
                thresholdNoncesById[_objectId],
                votesNeeded,
                _senderAddress,
                _msgSender(),
                address(this),
                _objectId
            )
        );
        address signer = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    hashRecover
                )
            ),
            v,
            r,
            s
        );
        require(
            signer == serverAddress,
            "SIGNER MUST BE SERVER in thresholdVerify"
        );
        thresholdNoncesById[_objectId]++;
        return signer == serverAddress;
    }

    function deployDiamondVerify(
        address _senderAddress,
        string memory _projectId,
        bytes32 r,
        bytes32 s,
        uint8 v
    ) public returns (bool) {
        bytes32 hashRecover = keccak256(
            abi.encodePacked(
                deployNoncesById[_projectId],
                _senderAddress,
                _msgSender(),
                address(this),
                _projectId
            )
        );
        address signer = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    hashRecover
                )
            ),
            v,
            r,
            s
        );
        require(
            signer == serverAddress,
            "SIGNER MUST BE SERVER in deployDiamondVerify"
        );
        deployNoncesById[_projectId]++;
        return signer == serverAddress;
    }

    function setServerAddress(address _newAddress) public {
        require(approvers[_msgSender()], "must be approved");
        require(_newAddress != address(0));
        serverAddress = _newAddress;
    }
}
