import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Mock categories data
    const categories = [
      { id: 1, name: 'Aksiyon', slug: 'aksiyon' },
      { id: 2, name: 'Komedi', slug: 'komedi' },
      { id: 3, name: 'Drama', slug: 'drama' },
      { id: 4, name: 'Korku', slug: 'korku' },
      { id: 5, name: 'Romantik', slug: 'romantik' },
      { id: 6, name: 'Bilim Kurgu', slug: 'bilim-kurgu' }
    ];

    res.status(200).json(categories);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
