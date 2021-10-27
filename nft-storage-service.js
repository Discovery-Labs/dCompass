import { NFTStorage, File } from 'nft.storage'
import fs from 'fs';


function getAccessToken() {
    return process.env.NFTSTORAGE_TOKEN
  }

export function makeNFTStorageClient(){
    return new NFTStorage({ token: getAccessToken() })
}

export async function storeNFTData(_name, _description, _did, quest, imageURI){
    const client = makeNFTStorageClient();

    const metadata = await client.store({
        name: _did,
        description: _description,
        image: new File(
          
            [await fs.promises.readFile(`${_name}.jpg`)],
          
          `${_name}.jpg`,
          { type: 'image/jpg' }
        ),
        properties: {
            custom: `${quest}`
        }
      })
      console.log(process.cwd());
      
      return metadata.url;
}