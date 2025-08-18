'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  // Random movie categories and content
  const categories = [
    'Aksiyon & Macera',
    'Komedi',
    'Drama',
    'Bilim Kurgu',
    'Gerilim',
    'Romantik',
    'Belgesel',
    'Animasyon',
    'Korku',
    'Savaş'
  ]

  // Random featured movies
  const featuredMovies = [
    { title: 'Kurtlar Vadisi', genre: 'Aksiyon', year: '2024', rating: '8.5' },
    { title: 'Yıldızlar Arası', genre: 'Bilim Kurgu', year: '2023', rating: '9.1' },
    { title: 'Komedi Gecesi', genre: 'Komedi', year: '2024', rating: '7.8' },
    { title: 'Dramatik Hikaye', genre: 'Drama', year: '2023', rating: '8.9' },
    { title: 'Gerilim Dolu', genre: 'Gerilim', year: '2024', rating: '8.2' }
  ]

  // Random background images
  const backgrounds = [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518156677180-95a2893f349a?w=1200&h=800&fit=crop'
  ]

  // Select random elements
  const randomCategory = categories[Math.floor(Math.random() * categories.length)]
  const randomMovie = featuredMovies[Math.floor(Math.random() * featuredMovies.length)]
  const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)]

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${randomBackground})` }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl font-bold text-red-500 mb-4"
            style={{
              textShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
              letterSpacing: '0.1em'
            }}
          >
            FILMXANE
          </motion.div>
          <p className="text-xl text-gray-300">Türk Sinema Platformu</p>
        </motion.div>

        {/* Random Category Section */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🎬 {randomCategory} Kategorisi
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-700/80 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-full h-32 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-md mb-3 flex items-center justify-center">
                    <span className="text-4xl">🎭</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Film {i}</h3>
                  <p className="text-gray-400 text-sm">Bu kategoride harika bir film</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Random Featured Movie */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold text-white mb-4">⭐ Öne Çıkan Film</h3>
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-red-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
            <h4 className="text-2xl font-bold text-white mb-2">{randomMovie.title}</h4>
            <div className="flex justify-center space-x-6 text-gray-300 mb-4">
              <span>🎭 {randomMovie.genre}</span>
              <span>📅 {randomMovie.year}</span>
              <span>⭐ {randomMovie.rating}</span>
            </div>
            <p className="text-gray-300">Bu filmi mutlaka izlemelisiniz!</p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <div className="flex justify-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              🎬 Filmleri Keşfet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              📺 Dizileri İncele
            </motion.button>
          </div>
        </motion.div>

        {/* Loading Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-12"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
            ))}
          </div>
          <p className="text-gray-400 mt-2">İçerik yükleniyor...</p>
        </motion.div>
      </div>
    </div>
  )
}
