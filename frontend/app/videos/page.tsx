'use client'

import { useState } from 'react'
// import { motion } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
import { Search, Film, TrendingUp, Star, Clock, Users } from 'lucide-react'
import { VideoRow } from '@/components/VideoRow'
import { useContent } from '@/contexts/ContentContext'
import { getSafeImageUrl } from '@/lib/utils'

export default function VideosPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { movies, series, categories, isLoading } = useContent()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true)
      // TODO: Implement actual search functionality
      console.log('Searching for:', searchQuery)
      
      // Simulate search delay
      setTimeout(() => {
        setIsSearching(false)
        alert(`Lêgerîna ji bo "${searchQuery}" dê were nîşandan...`)
      }, 1000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Create video categories from real API data
  const videoCategories = [
    {
      id: 'featured',
      title: 'Taybet',
      videos: [...(movies || []), ...(series || [])].filter(content => content.isFeatured)
    },
    {
      id: 'new-releases',
      title: 'Nû',
      videos: [...(movies || []), ...(series || [])].filter(content => content.isNew)
    },
    {
      id: 'trending',
      title: 'Trend',
      videos: [...(movies || []), ...(series || [])].filter(content => content.rating >= 4.5)
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Hero Background with Featured Content */}
          {movies && movies.length > 0 && (
            <div className="relative mb-12">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
                style={{ 
                  backgroundImage: `url('${getSafeImageUrl(movies[0]?.thumbnailUrl || movies[0]?.posterUrl || movies[0]?.thumbnail, 1920, 600, 'thumbnail')}')` 
                }}
              />
              <div className="absolute inset-0 bg-black/60 rounded-2xl" />
              <div className="relative z-10 py-16 px-8">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
                    Hemû Fîlm û Rêzefîlm
                  </span>
                </h1>
                <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-8">
                  Herî baştirîn naverokên kurdî û cîhanî bibîne û temaşe bike
                </p>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Fîlm, rêzefîlm an jî aktor lêbigere..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 hover:scale-105 active:scale-95"
              >
                {isSearching ? 'Lêdigere...' : 'Lêbigere'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Categories */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              <p className="text-slate-400 mt-4">Naverok tê barkirin...</p>
            </div>
          ) : videoCategories.map((category, index) => (
            <VideoRow
              key={category.id}
              title={category.title}
              videos={category.videos}
              category={category.id}
              showProgress={category.id === 'continue-watching'}
              className={index > 0 ? 'mt-16' : ''}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
