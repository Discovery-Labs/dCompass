import { ethers } from 'ethers';

type VerifyInput = {
  nonceId: number;
  senderAddress: string;
  contractAddress: string;
  verifyContract: string;
  objectId: string;
  votesNeeded?: number;
};

type VerifyAdventurerClaimInput = {
  nonceId: number;
  senderAddress: string;
  contractAddress: string;
  verifyContract?: string;
  objectId: string;
  chainId: number;
  version?: number;
};

export const verifyNFTInfo = async function ({
  nonceId,
  senderAddress,
  contractAddress,
  verifyContract,
  objectId,
  votesNeeded,
}: VerifyInput) {
  const signingKey = process.env.PRIVATE_KEY;
  if (!signingKey) {
    throw Error('Signing key missing');
  }
  const wallet = new ethers.Wallet(signingKey);
  console.log(wallet, [
    nonceId,
    senderAddress,
    contractAddress,
    verifyContract,
    objectId,
  ]);
  let hashMsg = ethers.utils.solidityKeccak256(
    ['uint256', 'address', 'address', 'address', 'string'],
    [nonceId, senderAddress, contractAddress, verifyContract, objectId],
  );

  if (votesNeeded) {
    hashMsg = ethers.utils.solidityKeccak256(
      ['uint256', 'uint256', 'address', 'address', 'address', 'string'],
      [
        nonceId,
        votesNeeded,
        senderAddress,
        contractAddress,
        verifyContract,
        objectId,
      ],
    );
  }

  const messageHashBytes = ethers.utils.arrayify(hashMsg);
  const flatSig = await wallet.signMessage(messageHashBytes);

  const expandedSignature = ethers.utils.splitSignature(flatSig);
  return expandedSignature;
};

export const verifyAdventurerClaimInfo = async function ({
  nonceId,
  senderAddress,
  contractAddress,
  objectId,
  chainId,
  version = 0,
}: VerifyAdventurerClaimInput) {
  const signingKey = process.env.PRIVATE_KEY;
  if (!signingKey) {
    throw Error('Signing key missing');
  }
  const wallet = new ethers.Wallet(signingKey);

  const hashMsg = ethers.utils.solidityKeccak256(
    ['address', 'address', 'uint256', 'uint', 'uint256', 'string'],
    [senderAddress, contractAddress, chainId, nonceId, version, objectId],
  );

  const messageHashBytes = ethers.utils.arrayify(hashMsg);
  const flatSig = await wallet.signMessage(messageHashBytes);

  const expandedSignature = ethers.utils.splitSignature(flatSig);
  return expandedSignature;
};
