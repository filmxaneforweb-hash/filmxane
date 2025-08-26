'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Play, Heart, Clock, Star } from 'lucide-react'
import { VideoCard } from '@/components/VideoCard'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { getSafeImageUrl } from '@/lib/utils'

export default function MoviesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [movies, setMovies] = useState<any[]>([])
  const [allGenres, setAllGenres] = useState<string[]>([])
  const [allYears, setAllYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Watch movie function
  const handleWatchMovie = (movieId: string) => {
    router.push(`/videos/${movieId}`)
  }

  // Fetch movies from API with filters
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching movies with filters...')
        
        const response = await apiClient.searchWithFilters({
          type: 'movie',
          query: searchQuery || undefined,
          genre: selectedGenre !== 'all' ? selectedGenre : undefined,
          year: selectedYear !== 'all' ? selectedYear : undefined,
          rating: selectedRating !== 'all' ? selectedRating : undefined,
          page: currentPage,
          limit: 20
        })
        
        console.log('📊 Movies response:', response)
        
        if (response.success && response.data) {
          setMovies(response.data.items)
          setTotalResults(response.data.total)
          setTotalPages(response.data.totalPages)
        } else {
          console.error('❌ Failed to fetch movies:', response.error)
          setError(response.error || 'Failed to fetch movies')
        }
      } catch (error) {
        console.error('❌ Error fetching movies:', error)
        setError('Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    }

    // Debounce search query - wait 500ms after user stops typing
    const timeoutId = setTimeout(() => {
      fetchMovies()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedGenre, selectedYear, selectedRating, currentPage])

  // Fetch all genres and years on component mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch genres
        const genresResponse = await apiClient.getAllGenres()
        if (genresResponse.success && genresResponse.data) {
          setAllGenres(genresResponse.data)
        }
        
        // Fetch years
        const yearsResponse = await apiClient.getAllYears()
        if (yearsResponse.success && yearsResponse.data) {
          setAllYears(yearsResponse.data)
        }
      } catch (error) {
        console.error('❌ Error fetching filters:', error)
      }
    }

    fetchFilters()
  }, [])

  // Use backend data for genres and years
  const genres = ['all', ...allGenres]
  const years = ['all', ...allYears]

  // Movies are already filtered by backend
  const filteredMovies = movies

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value)
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value)
    setCurrentPage(1) // Reset to first page
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRating(e.target.value)
    setCurrentPage(1)
  }



  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSelectedYear('all')
    setSelectedRating('all')
    setCurrentPage(1)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Fîlm tê barkirin...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Çewtiyek çêbû</h1>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Dîsa biceribîne
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Fîlmên
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Fîlmên herî baş û nû yên cîhanê bibînin û bixwînin
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Fîlmek bigere..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Genre Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedGenre}
                onChange={handleGenreChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre} className="bg-gray-800 text-white">
                    {genre === 'all' ? 'Hemû Cure' : genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-800 text-white">
                    {year === 'all' ? 'Hemû Sal' : year}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRating}
                onChange={handleRatingChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all" className="bg-gray-800 text-white">Hemû Rating</option>
                <option value="9-10" className="bg-gray-800 text-white">9+ (Mükemmel)</option>
                <option value="8-9" className="bg-gray-800 text-white">8+ (Çok İyi)</option>
                <option value="7-8" className="bg-gray-800 text-white">7+ (İyi)</option>
                <option value="6-7" className="bg-gray-800 text-white">6+ (Orta)</option>
                <option value="5-6" className="bg-gray-800 text-white">5+ (Kabul Edilebilir)</option>
              </select>
            </div>
          </div>

          

          {/* Reset Filters Button */}
          <div className="flex justify-center">
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtreleri Sıfırla
            </button>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <p className="text-gray-400">
            {totalResults} fîlm hat dîtin
            {searchQuery && ` ji bo "${searchQuery}"`}
            {selectedGenre !== 'all' && ` di cureya "${selectedGenre}" de`}
            {selectedYear !== 'all' && ` di sala "${selectedYear}" de`}
                         {selectedRating !== 'all' && ` rating ${selectedRating}`}
          </p>
        </motion.div>

        {/* Movies Grid */}
        {filteredMovies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <VideoCard
                  id={movie.id}
                  title={movie.title || 'Untitled Movie'}
                  description={movie.description || ''}
                  thumbnail={movie.thumbnail}
                  thumbnailUrl={movie.thumbnailUrl}
                  posterUrl={movie.posterUrl}
                  duration={movie.duration}
                  rating={movie.rating}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Fîlm nehat dîtin</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `Ji bo "${searchQuery}" fîlm nehat dîtin.` 
                : 'Di vê kategoriyê de fîlm tune ne.'
              }
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Hemû Fîlmên Bibînin
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <div className="flex items-center space-x-2">
              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Önceki
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sonraki →
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
