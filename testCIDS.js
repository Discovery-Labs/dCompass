const CID = require('cids')
const web3 = require('web3')
const cid = new CID('QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR').toV1().toString('base16');
console.log(cid.length);
const BN = web3.utils.toBN(cid.slice(9));
console.log(BN.toString());