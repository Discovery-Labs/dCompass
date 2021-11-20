const { ethers } = require("ethers");
require('dotenv').config();

const verifyNFTInfo = async function(nonce, account, stringId, sender){
    const serverAddress =  process.env.SERVER_ADDRESS;
    const signingKey = process.env.PRIVATE_KEY;
    let wallet = new ethers.Wallet(signingKey);

    const hashMsg = ethers.utils.solidityKeccak256(["uint256", "address", "address", "string", "address"], [nonce, account, serverAddress, stringId, sender]);

    let messageHashBytes = ethers.utils.arrayify(hashMsg);
    let flatSig = await wallet.signMessage(messageHashBytes);

    let sig = ethers.utils.splitSignature(flatSig);

    return sig;
}