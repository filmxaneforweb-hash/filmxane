export default function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Mock authentication
    if (email === 'admin@filmxane.com' && password === 'admin123') {
      res.status(200).json({
        success: true,
        message: 'Giriş başarılı',
        user: {
          id: 1,
          email: 'admin@filmxane.com',
          name: 'Admin',
          role: 'admin'
        },
        token: 'mock-jwt-token-12345'
      });
    } else if (email && password) {
      res.status(200).json({
        success: true,
        message: 'Giriş başarılı',
        user: {
          id: 2,
          email: email,
          name: 'Kullanıcı',
          role: 'user'
        },
        token: 'mock-jwt-token-67890'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Email ve şifre gerekli'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
