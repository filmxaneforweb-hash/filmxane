import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

  return NextResponse.json(videos);
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
