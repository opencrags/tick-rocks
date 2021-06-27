import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import getConfig from "next/config";

export default withApiAuthRequired(async function api(req, res) {
  const { accessToken } = await getAccessToken(req, res);
  res.status(200).json(
    JSON.stringify({
      Authorization: `Bearer ${accessToken}`,
    })
  );
});
