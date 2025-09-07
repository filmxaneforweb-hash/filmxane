import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Mock categories data
  const categories = [
    { id: 1, name: 'Aksiyon', slug: 'aksiyon' },
    { id: 2, name: 'Komedi', slug: 'komedi' },
    { id: 3, name: 'Drama', slug: 'drama' },
    { id: 4, name: 'Korku', slug: 'korku' },
    { id: 5, name: 'Romantik', slug: 'romantik' },
    { id: 6, name: 'Bilim Kurgu', slug: 'bilim-kurgu' }
  ];

  const response = NextResponse.json(categories);
  
  // CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
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
