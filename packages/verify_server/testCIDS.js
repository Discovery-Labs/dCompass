const CID = require('cids')
const web3 = require('web3')

const cids = ['QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR', 'QmU117Mm2oV1cQvUUWJxxFJ5Rj5FMWm7UcrRDbRMtVpX3C']

function splitCIDS(cids){
    let base16cids = Array(cids.length);
    let firstParts = Array(cids.length);
    let secondParts = Array(cids.length);
    cids.forEach((elem , index) => {
        base16cids[index] = new CID(elem).toV1().toString('base16');
        firstParts[index] = `0x${base16cids[index].slice(1,9)}`;
        secondParts[index] = `0x${base16cids[index].slice(9)}`;
    });
    return {base16cids , firstParts, secondParts}

}
const testCids = splitCIDS(cids);
Object.keys(testCids).forEach((k) =>{
    console.log(k)
    console.log(testCids[k]);
})
