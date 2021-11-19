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
  const { logo, ...squadFiles } = form.files;
  const properties = JSON.parse(form.fields.metadata);
  const storeCids = properties.squads.flatMap((squad: any) => {
    console.log({ squadFiles, squad });
    const squadFile = squadFiles[squad.name][0];
    console.log({ squadFile });
    const name = squadFile.originalFilename as string;
    const f = new File([fs.readFileSync(squadFile.path)], name, {
      type: "image/*",
    });

    return squad.members.map(async (member: string) =>
      nftStorage.store({
        name,
        description: `dCompass NFT for being a member of the ${squad.name} squad in ${properties.name}`,
        image: f,
        properties: { OG_NFT_OWNER: member, ...properties },
      })
    );
  });

  const nftCids = await Promise.all(storeCids);

  return res
    .status(200)
    .json({ metadataCids: nftCids.map((cid: any) => cid.url) });
}

// first we need to disable the default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};
export default handler;
