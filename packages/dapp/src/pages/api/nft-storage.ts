// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as fs from "fs";
import multiparty from "multiparty";
import { NextApiRequest, NextApiResponse } from "next";
import { NFTStorage, File } from "nft.storage";

type Form = {
  fields: any;
  files: any;
};

function parseForm(req: NextApiRequest): Promise<Form> {
  const form = new multiparty.Form();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          fields,
          files,
        });
      }
    });
  });
}

function getNFTStorageToken(): string {
  const token = process.env.NFTSTORAGE_TOKEN;
  if (!token) throw new Error(`Misconfigured: nft.storage token`);
  return token;
}

const nftStorage = new NFTStorage({ token: getNFTStorageToken() });
// example using NFT storage for a single image

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = await parseForm(req);
  const file = form.files.logo[0];
  const properties = JSON.parse(form.fields.metadata);
  const name = file.originalFilename as string;
  const f = new File([fs.readFileSync(file.path)], name, { type: "image/*" });
  const nftCid = await nftStorage.store({
    name,
    description: `Genesis ${properties.name} NFT`,
    image: f,
    properties,
  });
  res.status(200).json({ cid: nftCid });
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;
