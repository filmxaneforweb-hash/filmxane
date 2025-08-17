'use client'

import { HeroSection } from '@/components/HeroSection'
import { ContentGrid } from '@/components/ContentGrid'
import { useContent } from '@/contexts/ContentContext'
import { motion } from 'framer-motion'

export default function HomePage() {
  const { 
    movies, 
    series, 
    featuredContent, 
    newReleases, 
    categories, 
    isLoading 
  } = useContent()

  // Loading sadece ilk yüklemede göster, veri yoksa da sayfa göster
  if (isLoading && movies.length === 0 && series.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Tê barkirin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <HeroSection />

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
