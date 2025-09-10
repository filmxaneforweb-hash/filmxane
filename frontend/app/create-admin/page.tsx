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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 saniye timeout

      console.log('Admin oluşturma isteği gönderiliyor...', formData);

      const response = await fetch('https://filmxane-backend.onrender.com/api/admin/create-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          secretKey: 'filmxane-admin-2024-secret'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Backend yanıtı:', response.status, response.statusText);

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Bikarhênera rêveberê bi serkeftî hat çêkirin!');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setMessage(`❌ Hata: ${data.message}`);
      }
    } catch (error) {
      console.error('Admin creation error:', error);
      if (error.name === 'AbortError') {
        setMessage('❌ Dema derbasbûnê: Servîsa backend bersiv nade. Servîsa backend li Render.com\'ê dîsa destpêk bikin.');
      } else if (error.message.includes('Failed to fetch')) {
        setMessage('❌ Çewtiya girêdanê: Servîsa backend naxebite. Servîsa backend li Render.com\'ê dîsa destpêk bikin.');
      } else {
        setMessage(`❌ Çewtî: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6 text-red-500">
            Hesaba Rêveberê Çêke
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
              <label className="block text-sm font-medium mb-2">Şîfre</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Şîfreya xurt binivîse"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mifteya Ewlehiyê</label>
              <input
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData({...formData, secretKey: e.target.value})}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Mifteya ewlehiyê binivîse"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              {loading ? 'Tê çêkirin...' : 'Rêveber Çêke'}
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
              ← Vegere Serê Rûpelê
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
