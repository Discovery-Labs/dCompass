import { NFTStorage, File } from 'nft.storage'


function getAccessToken() {
    return process.env.NFTSTORAGE_TOKEN
  }

export function makeNFTStorageClient(){
    return new NFTStorage({ token: getAccessToken() })
}
//pass in a name, description, properties Object (custom : et al) and an imageURI
export async function storeNFTData(_name, _description, properties, imageURI){
    const client = makeNFTStorageClient();

    const metadata = await client.store({
        name: _name,
        description: _description,
        image: imageURI,
        properties: properties
      })
      console.log(process.cwd());
      
      return metadata.url;
}