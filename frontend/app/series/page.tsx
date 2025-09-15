'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
import { Search, Filter, Play, Heart, Clock, Star } from 'lucide-react'
import { VideoCard } from '@/components/VideoCard'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'
import { getSafeImageUrl } from '@/lib/utils'

export default function SeriesPage() {

  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('') // Separate state for input
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [series, setSeries] = useState<any[]>([])
  const [allGenres, setAllGenres] = useState<string[]>([])
  const [allYears, setAllYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(0)

  // Fetch series from API with filters
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching series...')
        
        // Direct API call for faster loading
        const response = await fetch('https://filmxane-backend.onrender.com/api/videos')
        const allVideos = await response.json()
        
        // Filter series only
        const seriesData = allVideos.filter((video: any) => video.type === 'series')
        
        console.log('📊 Series data:', seriesData)
        
        if (seriesData && seriesData.length > 0) {
          setSeries(seriesData)
          setTotalPages(1)
          
          // Extract genres and years for filters
          const genres = [...new Set(seriesData.flatMap(series => 
            typeof series.genre === 'string' ? JSON.parse(series.genre) : series.genre || []
          ))] as string[]
          setAllGenres(genres)
          
          const years = [...new Set(seriesData.map(series => series.year).filter(Boolean))] as number[]
          setAllYears(years.sort((a, b) => b - a))
        } else {
          console.log('📊 No series found')
          setSeries([])
          setError('No series found')
        }
      } catch (error) {
        console.error('❌ Error fetching series:', error)
        setError('Failed to fetch series')
      } finally {
        setLoading(false)
      }
    }

    fetchSeries()
  }, [searchQuery, selectedGenre, selectedYear, selectedRating, currentPage])

  // Filters are now loaded with the main data fetch

  // Use backend data for genres and years
  const genres = ['all', ...allGenres]
  const years = ['all', ...allYears]

  // Series are already filtered by backend
  // Filter series based on search query and filters
  const filteredSeries = series.filter(show => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase()
      const titleMatch = show.title?.toLowerCase().includes(searchLower)
      const descriptionMatch = show.description?.toLowerCase().includes(searchLower)
      if (!titleMatch && !descriptionMatch) return false
    }

    // Genre filter
    if (selectedGenre !== 'all') {
      const showGenres = typeof show.genre === 'string' ? JSON.parse(show.genre) : show.genre || []
      if (!showGenres.includes(selectedGenre)) return false
    }

    // Year filter
    if (selectedYear !== 'all') {
      if (show.year !== parseInt(selectedYear)) return false
    }

    return true
  })

  // Debounce input changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(inputValue)
    }, 1200) // 1200ms delay for input

    return () => clearTimeout(timeoutId)
  }, [inputValue])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
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
    setInputValue('')
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
          <p className="text-white text-lg">Rêzefîlm tê barkirin...</p>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
              Rêzefîlmên
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Rêzefîlmên herî baş û nû yên cîhanê bibînin û bixwînin
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rêzefîlmek bigere..."
              value={inputValue}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
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
              Filtreyan Paqij Bike
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredSeries.length} rêzefîlm hat dîtin
            {searchQuery && ` ji bo "${searchQuery}"`}
            {selectedGenre !== 'all' && ` di cureya "${selectedGenre}" de`}
            {selectedYear !== 'all' && ` di "${selectedYear}" de`}
                         {selectedRating !== 'all' && ` rating ${selectedRating}`}
          </p>
        </div>

        {/* Series Grid */}
        {filteredSeries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredSeries.map((show, index) => (
              <div key={show.id}>
                <VideoCard
                  id={show.id}
                  title={show.title}
                  description={show.description}
                  thumbnail={show.thumbnail}
                  thumbnailUrl={show.thumbnailUrl}
                  posterUrl={show.posterUrl}
                  duration={show.duration}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">Rêzefîlm nehat dîtin</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? `Ji bo "${searchQuery}" rêzefîlm nehat dîtin.` 
                : 'Di vê kategoriyê de rêzefîlm tune ne.'
              }
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Hemû Rêzefîlmên Bibînin
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              {/* Previous Page */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Berê
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
                          ? 'bg-blue-600 text-white'
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
                Paşê →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
