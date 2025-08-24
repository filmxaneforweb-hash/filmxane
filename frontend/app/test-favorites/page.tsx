'use client'

import { useState } from 'react'
import { VideoCard } from '@/components/VideoCard'

export default function TestFavoritesPage() {
  const [testVideo] = useState({
    id: '1',
    title: 'Test Film',
    description: 'Bu bir test filmidir',
    thumbnailUrl: 'https://via.placeholder.com/300x200/ff0000/ffffff?text=Test+Film',
    duration: 120,
    rating: 8.5,
    views: 1000
  })

  const handleWatch = () => {
    console.log('Watch clicked for:', testVideo.title)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🧪 Favori Ekleme Testi</h1>
        
        <div className="bg-slate-800/50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Talimatları:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Önce giriş yapın (login sayfasından)</li>
            <li>Bu sayfaya geri dönün</li>
            <li>Aşağıdaki test filminin kalp ikonuna tıklayın</li>
            <li>Console'da debug log'ları kontrol edin</li>
            <li>Backend console'unda da log'ları kontrol edin</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <VideoCard
            id={testVideo.id}
            title={testVideo.title}
            description={testVideo.description}
            thumbnailUrl={testVideo.thumbnailUrl}
            duration={testVideo.duration}
            rating={testVideo.rating}
            views={testVideo.views}
            onWatch={handleWatch}
          />
        </div>

        <div className="mt-8 bg-slate-800/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">🔍 Debug Bilgileri:</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Video ID: <code className="bg-slate-700 px-2 py-1 rounded">{testVideo.id}</code></p>
            <p>• Backend URL: <code className="bg-slate-700 px-2 py-1 rounded">http://localhost:3005/api/favorites</code></p>
            <p>• Console'u açın (F12) ve Network sekmesini kontrol edin</p>
            <p>• Backend terminal'inde log'ları kontrol edin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
