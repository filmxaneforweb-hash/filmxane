'use client'

import { HeroSection } from '@/components/HeroSection'
import { ContentGrid } from '@/components/ContentGrid'
import { useContent } from '@/contexts/ContentContext'
import { motion } from 'framer-motion'
import { getSafeImageUrl } from '@/lib/utils'

export default function HomePage() {
  const { 
    movies, 
    series, 
    featuredContent, 
    newReleases, 
    categories, 
    isLoading 
  } = useContent()



  // Loading state'inde sadece basit loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">İçerik yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Netflix Tarzında Hero Alanı - Sadece film varsa göster */}
      {movies && movies.length > 0 && movies[0] && (
        <section className="relative h-screen overflow-hidden">
          {/* Background Movie Poster */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${getSafeImageUrl(movies[0]?.thumbnailUrl || movies[0]?.posterUrl || movies[0]?.thumbnail, 1920, 1080, 'thumbnail')}')` 
            }}
          />
          
          {/* Dark Overlay - Netflix Style */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-20">
            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl"
            >
              {/* Movie Title */}
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  lineHeight: '0.9'
                }}
              >
                {movies[0]?.title}
              </motion.h1>

              {/* Movie Meta Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex items-center space-x-6 text-gray-300 mb-6 text-lg"
              >
                {movies[0]?.rating && (
                  <span className="flex items-center">
                    <span className="text-green-400 mr-2">●</span>
                    {movies[0]?.rating}
                  </span>
                )}
                {movies[0]?.year && (
                  <span>{movies[0]?.year}</span>
                )}
                {movies[0]?.duration && (
                  <span>{Math.floor((movies[0]?.duration || 0) / 60)}d</span>
                )}
                <span className="bg-gray-800 px-2 py-1 rounded text-sm">HD</span>
              </motion.div>

              {/* Movie Description */}
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed"
              >
                {movies[0]?.description || 'Bu film hakkında detaylı bilgi için tıklayın.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = `/videos/${movies[0]?.id}`}
                  className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors text-lg flex items-center justify-center cursor-pointer"
                >
                  <span className="mr-2">▶️</span>
                  İzle
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Film detaylarını modal'da göster
                    alert(`${movies[0]?.title}\n\n${movies[0]?.description || 'Bu film hakkında detaylı bilgi bulunmuyor.'}\n\nTür: ${movies[0]?.genre || 'Belirtilmemiş'}\nYıl: ${movies[0]?.year || 'Belirtilmemiş'}\nPuan: ${movies[0]?.rating || 'Belirtilmemiş'}`)
                  }}
                  className="px-8 py-4 bg-gray-600/80 text-white rounded-lg font-semibold hover:bg-gray-500/80 transition-colors text-lg flex items-center justify-center backdrop-blur-sm cursor-pointer"
                >
                  <span className="mr-2">ℹ️</span>
                  Daha Fazla Bilgi
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        {/* New Releases */}
        {newReleases && newReleases.length > 0 && (
          <ContentGrid
            title="Nû Hat"
            subtitle="Çîroka nû ya ciwan"
            items={newReleases}
            showViewAll
            viewAllLink="/videos"
          />
        )}

        {/* Featured Movies */}
        {movies && movies.filter(m => m.isFeatured)?.length > 0 && (
          <ContentGrid
            title="Fîlmên Taybet"
            subtitle="Çîroka herî baş"
            items={movies.filter(m => m.isFeatured)}
            showViewAll
            viewAllLink="/movies"
          />
        )}

        {/* Featured Series */}
        {series && series.filter(s => s.isFeatured)?.length > 0 && (
          <ContentGrid
            title="Rêzefîlmên Taybet"
            subtitle="Çîroka herî baş"
            items={series.filter(s => s.isFeatured)}
            showViewAll
            viewAllLink="/series"
          />
        )}

        {/* Action Movies */}
        {movies && movies.filter(m => {
          if (!m.genre) return false
          const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
          return genres.includes('Action')
        })?.length > 0 && (
          <ContentGrid
            title="Fîlmên Çalakî"
            subtitle="Hêz û lez"
            items={movies.filter(m => {
              if (!m.genre) return false
              const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
              return genres.includes('Action')
            })}
            showViewAll
            viewAllLink="/movies?genre=Action"
          />
        )}

        {/* Drama Series */}
        {series && series.filter(s => {
          if (!s.genre) return false
          const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : s.genre
          return genres.includes('Drama')
        })?.length > 0 && (
          <ContentGrid
            title="Rêzefîlmên Drama"
            subtitle="Çîroka dil"
            items={series.filter(s => {
              if (!s.genre) return false
              const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : s.genre
              return genres.includes('Drama')
            })}
            showViewAll
            viewAllLink="/series?genre=Drama"
          />
        )}

        {/* Comedy Content */}
        {[...(movies || []), ...(series || [])].filter(c => {
          if (!c.genre) return false
          const genres = typeof c.genre === 'string' ? JSON.parse(c.genre) : c.genre
          return genres.includes('Comedy')
        }).length > 0 && (
          <ContentGrid
            title="Komedî"
            subtitle="Ken û şahî"
            items={[...(movies || []), ...(series || [])].filter(c => {
              if (!c.genre) return false
              const genres = typeof c.genre === 'string' ? JSON.parse(c.genre) : c.genre
              return genres.includes('Comedy')
            })}
            showViewAll
            viewAllLink="/search?genre=Comedy"
          />
        )}

        {/* High Rated Content */}
        {[...(movies || []), ...(series || [])].filter(c => c.rating && c.rating >= 8).length > 0 && (
          <ContentGrid
            title="Herî Baş"
            subtitle="Ji aliyê temaşevanan ve"
            items={[...(movies || []), ...(series || [])].filter(c => c.rating && c.rating >= 8).sort((a, b) => b.rating - a.rating)}
            showViewAll
            viewAllLink="/search?sortBy=rating&sortOrder=desc"
          />
        )}

        {/* No Content Message */}
        {(!movies || movies.length === 0) && (!series || series.length === 0) && !isLoading && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg mb-4">
              🔍 Hîn naverok nehatiye barkirin
            </div>
            <p className="text-gray-500">
              Pêwendiya API nehatiye avakirin an jî hîn naverok nehatiye zêdekirin.
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <motion.section 
        className="py-16 bg-gradient-to-r from-slate-900 to-black"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 md:px-8 text-center">
          {/* Giriş ile ilgili tüm metinler kaldırıldı */}
        </div>
      </motion.section>

      {/* Auth Info Section - KALDIRILDI - Üstteki Hero Section zaten giriş butonlarını içeriyor */}
    </div>
  )
}
