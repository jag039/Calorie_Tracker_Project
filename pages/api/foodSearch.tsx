import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler to perform a food search using FatSecret's API.
 * 
 * This endpoint first retrieves an OAuth token from a local endpoint, then uses that token
 * to make a search request to the FatSecret API. The search expression is passed as a query parameter.
 * 
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The outgoing response object.
 * @returns {void} - The response is sent back to the client with either the search results or an error message.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch the token from the local /api/token endpoint
    const tokenResponse = await fetch('http://localhost:3000/api/token');
    const tokenData = await tokenResponse.json();

    // Check if the token was successfully obtained
    if (!tokenData.access_token) {
      res.status(500).json({ error: 'Failed to obtain access token' });
      return;
    }
    const accessToken = tokenData.access_token;

    // Fetch food data from FatSecret API using the obtained token
    const { search_expression } = req.query;
    const foodSearchResponse = await fetch('https://platform.fatsecret.com/rest/server.api', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        method: 'foods.search.v3',
        search_expression: search_expression as string,
        format: 'json',
      }),
    });

    // Check if the request was successful
    if (!foodSearchResponse.ok) {
      throw new Error('Failed to fetch food data');
    }

    // Respond with the fetched food data
    const foodSearchData = await foodSearchResponse.json();
    res.status(200).json({foodSearchData});
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}