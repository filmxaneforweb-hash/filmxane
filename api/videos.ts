import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Mock videos data
    const videos = [
      {
        id: 1,
        title: 'Kürtçe Film 1',
        description: 'Güzel bir Kürtçe film',
        type: 'movie',
        duration: 120,
        thumbnail: '/placeholder-video.jpg',
        videoUrl: '/placeholder-video.mp4',
        category: 'Drama',
        year: 2023,
        rating: 8.5
      },
      {
        id: 2,
        title: 'Kürtçe Dizi 1',
        description: 'Harika bir Kürtçe dizi',
        type: 'series',
        duration: 45,
        thumbnail: '/placeholder-video.jpg',
        videoUrl: '/placeholder-video.mp4',
        category: 'Aksiyon',
        year: 2024,
        rating: 9.0,
        seasonNumber: 1,
        episodeNumber: 1
      }
    ];

    res.status(200).json(videos);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
