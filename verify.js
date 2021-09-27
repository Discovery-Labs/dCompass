const ethWallet = import('ethereumjs-wallet');
const fs = require('fs');
const { ethers } = require("ethers");
require('dotenv').config();
var Web3 = require('web3');

const serverAddress =  process.env.SERVER_ADDRESS;
const projectID = process.env.PROJECT_ID;
const privateKey = process.env.PRIVATE_KEY;

let wallet = new ethers.Wallet(privateKey);

const web3 = new Web3(new Web3.providers.HttpProvider(`https://kovan.infura.io/v3/${projectID}`));
const msg = "Test message";



const signTest = async function(message){
let sigObj = await web3.eth.accounts.sign(message, privateKey);

let msgHash = sigObj.messageHash;

let sig = sigObj.signature;

//console.log(msgHash2, sig2);
return {"hash" : msgHash, "signature" : sig}
}

const ethersSignTest = async function (hash) {
    let messageHashBytes = ethers.utils.arrayify(hash);
    let flatSig = await wallet.signMessage(messageHashBytes);

    console.log(flatSig);

    let sig = ethers.utils.splitSignature(flatSig);

    console.log(` r is : ${sig.r} \n s is : ${sig.s} \n v is : ${sig.v}`);

    
}


const hashMsg = ethers.utils.solidityKeccak256(["string", "address"], [msg, serverAddress]);
const hashMsg2 = ethers.utils.solidityKeccak256(["string", "bytes32"], ["\x19Ethereum Signed Message:\n32", hashMsg]);

// For Solidity, we need the expanded-format of a signature
//let sig = ethers.utils.splitSignature(flatSig);

const hashObj = signTest(hashMsg);

console.log(`${hashMsg} \n ${hashMsg2} \n signature `);
ethersSignTest(hashMsg);