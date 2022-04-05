import { NextApiRequest, NextApiResponse } from "next";

type Body = {
  ownerAddr: any;
  contractAddr: any;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body: Body = JSON.parse(req.body);
  const baseURL = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API}/getNFTs/`;

  if (body) {
    const response = await fetch(
      `${baseURL}?owner=${body.ownerAddr}&contractAddresses[]=${body.contractAddr}`
    );
    const data = await response.json();
    // console.log(data);
    return res.status(200).json(data);
  }
  return res.status(400).json({
    data: "No Data",
  });
}

export default handler;
