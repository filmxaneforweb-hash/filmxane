import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Mock authentication
    if (email === 'admin@filmxane.com' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        message: 'Giriş başarılı',
        data: {
          user: {
            id: 1,
            email: 'admin@filmxane.com',
            name: 'Admin',
            role: 'admin'
          },
          token: 'mock-jwt-token-12345'
        }
      });
    } else if (email && password) {
      return NextResponse.json({
        success: true,
        message: 'Giriş başarılı',
        data: {
          user: {
            id: 2,
            email: email,
            name: 'Kullanıcı',
            role: 'user'
          },
          token: 'mock-jwt-token-67890'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Email ve şifre gerekli'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 });
  }
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
