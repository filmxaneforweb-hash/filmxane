'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Play, Heart, Clock, Star, Tv } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { getSafeImageUrl } from '@/lib/utils'

export default function SeriesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [series, setSeries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Watch series function
  const handleWatchSeries = (seriesId: string) => {
    router.push(`/videos/${seriesId}`)
  }

  // Fetch series from API
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching series...')
        const response = await apiClient.getSeries()
        console.log('📊 Series response:', response)
        
        if (response.success && response.data) {
          // Backend'den gelen veriyi düzenle
          const formattedSeries = response.data.items || response.data || []
          console.log('📺 Formatted series:', formattedSeries)
          setSeries(formattedSeries)
        } else {
          console.error('❌ Failed to fetch series:', response.error)
          setError(response.error || 'Failed to fetch series')
        }
      } catch (error) {
        console.error('❌ Error fetching series:', error)
        setError('Failed to fetch series')
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [])

  // Get unique genres and years from series
  const genres = ['all', ...Array.from(new Set(
    series
      .map(show => {
        // Genre'yi parse et (JSON string veya array olabilir)
        if (typeof show.genre === 'string') {
          try {
            return JSON.parse(show.genre)
          } catch {
            return [show.genre]
          }
        }
        return show.genre || []
      })
      .flat()
      .filter(Boolean)
      .filter(genre => genre !== 'all') // 'all' seçeneğini tekrar ekleme
  ))]

  const years = ['all', ...Array.from(new Set(
    series
      .map(show => show.year || show.releaseYear)
      .filter(Boolean)
  )).sort((a, b) => b - a)]

  // Filter series based on search and filters
  const filteredSeries = series.filter(show => {
    const showGenre = typeof show.genre === 'string' 
      ? (() => {
          try { return JSON.parse(show.genre) } 
          catch { return [show.genre] }
        })()
      : (show.genre || [])
    
    const matchesSearch = show.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         show.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || showGenre.includes(selectedGenre)
    const matchesYear = selectedYear === 'all' || 
                       (show.year?.toString() === selectedYear || 
                        show.releaseYear?.toString() === selectedYear)
    
    return matchesSearch && matchesGenre && matchesYear
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
  }

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSelectedYear('all')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Rêzefîlmên Kurdî
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Rêzefîlmên herî baş û nû yên kurdî yên ku tu dixwazî bibînî
          </motion.p>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rêzefîlmeke lêbigere..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                {/* Genre Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedGenre}
                    onChange={(e) => handleGenreChange(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {genres.map((genre) => (
                      <option key={genre} value={genre}>
                        {genre === 'all' ? 'Hemû Cure' : genre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Filter */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'Hemû Sal' : year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-all duration-200 text-sm"
              >
                Filtreyan Paqij Bike
              </button>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-slate-400">
              {filteredSeries.length} rêzefîlm hat dîtin
            </div>
          </motion.div>
        </div>
      </section>

      {/* Series Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                Rêzefîlmên yên dîtin
              </h3>
              <p className="text-slate-500 mb-8">
                Ji kerema xwe pêşniyareke din lêbigere an jî filtreyan guherîne
              </p>
            </motion.div>
          ) : error ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-red-400 mb-4">
                {error}
              </h3>
              <p className="text-slate-500 mb-8">
                Ji kerema xwe pêşniyareke din lêbigere an jî filtreyan guherîne
              </p>
            </motion.div>
          ) : filteredSeries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSeries.map((show, index) => {
                // Genre'yi parse et
                const showGenre = typeof show.genre === 'string' 
                  ? (() => {
                      try { return JSON.parse(show.genre) } 
                      catch { return [show.genre] }
                    })()
                  : (show.genre || [])
                
                const displayGenre = Array.isArray(showGenre) ? showGenre[0] : showGenre
                
                return (
                  <motion.div
                    key={show.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group hover:scale-105"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center overflow-hidden">
                      {show.thumbnailUrl ? (
                        <img 
                          src={getSafeImageUrl(show.thumbnailUrl, 400, 225, 'thumbnail')} 
                          alt={show.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Resim yüklenemezse placeholder göster
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) {
                              placeholder.classList.remove('hidden');
                            }
                          }}
                        />
                      ) : (
                        // Test için basit placeholder resim
                        <img 
                          src={`https://via.placeholder.com/400x225/1f1f1f/ffffff?text=${encodeURIComponent(show.title)}`}
                          alt={show.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Genre Badge */}
                      {displayGenre && (
                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-blue-500/80 text-white text-xs rounded-full font-medium">
                            {displayGenre}
                          </span>
                        </div>
                      )}

                      {/* Episodes Badge */}
                      {show.totalEpisodes && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-slate-800/80 text-white text-xs rounded-full font-medium">
                            {show.totalEpisodes} Epîzod
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                        {show.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                        {show.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm mb-4">
                        <div className="flex items-center gap-4">
                          {show.totalSeasons && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-blue-400" />
                              <span className="text-slate-300">{show.totalSeasons} Sezon</span>
                            </div>
                          )}
                          {show.rating && (
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-slate-300">{show.rating}</span>
                            </div>
                          )}
                        </div>
                        <span className="text-slate-400">
                          {show.year || show.releaseYear}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleWatchSeries(show.id)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Temaşe Bike
                        </button>
                        <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-200">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Search className="w-24 h-24 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                Rêzefîlm hat dîtin
              </h3>
              <p className="text-slate-500 mb-8">
                Ji kerema xwe pêşniyareke din lêbigere an jî filtreyan guherîne
              </p>
              <button 
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Hemû Rêzefîlmên Bibîne
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
