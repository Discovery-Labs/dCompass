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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = await parseForm(req);
  const questFiles = form.files;
  const quest = JSON.parse(form.fields.metadata);
  const questFile = questFiles.image[0];
  const questFilename = questFile.originalFilename as string;
  const f = new File([fs.readFileSync(questFile.path)], questFilename, {
    type: "image/*",
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { image, description, name, ...questProperties } = quest;
  const nftStorageRes = await nftStorage.store({
    name,
    description,
    image: f,
    properties: {
      ...questProperties,
    },
  });

  return res.status(200).json({
    quest: quest.name,
    url: nftStorageRes.url,
  });
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;
