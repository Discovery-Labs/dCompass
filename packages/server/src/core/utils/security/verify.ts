import { ethers } from 'ethers';

type VerifyInput = {
  nonceId: number;
  senderAddress: string;
  contractAddress: string;
  verifyContract: string;
  objectId: string;
  votesNeeded?: number;
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
