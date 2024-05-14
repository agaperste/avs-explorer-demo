import { NextApiRequest, NextApiResponse } from 'next';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = 'https://api.dune.com/api/v1/eigenlayer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  if (typeof url !== 'string') {
    res.status(400).json({ error: 'Invalid URL parameter' });
    return;
  }

  const fullUrl = url.startsWith('https://') ? url : `${API_BASE_URL}/${url}`; // Check if url is already a full URL
  const requestOptions = {
    method: 'GET',
    headers: {
      'x-dune-api-key': process.env.DUNE_API_KEY || ""
    }
  };

  try {
    const response = await fetch(fullUrl, requestOptions);
    if (response.status !== 200) {
      res.status(response.status).json({ error: `HTTP error! status: ${response.status}` });
      return;
    }
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from Dune API:', error);
    res.status(500).json({ error: 'Failed to fetch data from Dune API' });
  }
}
