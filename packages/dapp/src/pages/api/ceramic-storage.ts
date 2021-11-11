import { NextApiRequest, NextApiResponse } from "next";

import { ceramicDataModelFactory } from "../../core/ceramic";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataStoreClient = await ceramicDataModelFactory();
  const body = JSON.parse(req.body);
  console.log(body);
  const newProjectStramId = await dataStoreClient.dataStore.set(
    "projects",
    // TODO: append only vs merge vs get + set pros & cons ?
    [body],
    {
      controller: dataStoreClient.did.id.toString(),
    }
  );
  return res.status(200).json({ projectStreamId: newProjectStramId });
}

// first we need to disable the default body parser
// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };
export default handler;
