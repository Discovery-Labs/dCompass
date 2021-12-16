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
  const badgeFiles = form.files;
  const properties = JSON.parse(form.fields.metadata);
  const storeCids = properties.badges.flatMap(async (badge: any) => {
    const badgeFile = badgeFiles[badge.title][0];
    const name = badgeFile.originalFilename as string;
    const f = new File([fs.readFileSync(badgeFile.path)], name, {
      type: "image/*",
    });

    const { image, description, title, ...badgeProperties } = badge;
    const nftStorageRes = await nftStorage.store({
      name: title,
      description,
      image: f,
      properties: {
        ...badgeProperties,
      },
    });
    return {
      badge: badge.title,
      url: nftStorageRes.url,
    };
  });

  const nftCids = await Promise.all(storeCids);

  return res.status(200).json({ metadataCids: nftCids });
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;