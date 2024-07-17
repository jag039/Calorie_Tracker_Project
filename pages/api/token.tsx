import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler to obtain an OAuth token from FatSecret.
 * 
 * This endpoint uses the client credentials grant type to obtain an access token.
 * The client ID and secret must be provided via environment variables.
 * 
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 * @returns {void} - The response is sent back to the client with either the token or an error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const clientID = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  if (!clientID || !clientSecret) {
    res.status(500).json({ error: 'Missing FATSECRET_CLIENT_ID or FATSECRET_CLIENT_SECRET environment variable' });
    return;
  }
  const authString = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
  try {
    const response = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'premier',
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      res.status(response.status).json({ error: errorData });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
