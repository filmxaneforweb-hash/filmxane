import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basit API response
  res.status(200).json({
    message: 'Filmxane API is running!',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
}
