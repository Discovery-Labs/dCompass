// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from "next";
const axios = require("axios");

async function handler(req: NextApiRequest, res: NextApiResponse) {
  //   console.log("req", req.body);

  let members;
  await axios({
    method: "get",
    url: process.env.MEMBERS_URL,
    params: {},
  })
    .then(function (response: { data: any }) {
      // handle success
      const membersData: Array<any> = response.data.records;
      members = membersData.map((member) => {
        return {
          name: member.fields.Name,
          description: member.fields.Description,
          image: member.fields.Image[0].url,
        };
      });
      console.log("members", members);
    })
    .catch(function (error: any) {
      // handle error
      console.log(error);
    });

  return res.status(200).json({
    members,
  });
}

export default handler;
