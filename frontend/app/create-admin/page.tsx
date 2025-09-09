'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateAdminPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    secretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://filmxane-backend.onrender.com/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Admin kullanıcısı başarıyla oluşturuldu!');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setMessage(`❌ Hata: ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Bağlantı hatası: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-500">
            Admin Hesabı Oluştur
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="admin@filmxane.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Şifre</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Güçlü bir şifre girin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Güvenlik Anahtarı</label>
              <input
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="filmxane-admin-2024-secret"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              {loading ? 'Oluşturuluyor...' : 'Admin Oluştur'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-md ${
              message.includes('✅') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-white transition duration-200"
            >
              ← Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
