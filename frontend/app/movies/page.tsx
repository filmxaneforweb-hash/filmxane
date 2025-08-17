'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Play, Heart, Clock, Star } from 'lucide-react'
import { VideoCard } from '@/components/VideoCard'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedYear, setSelectedYear] = useState('all')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await apiClient.getMovies()
        if (response.success && response.data) {
          setMovies(response.data.items || [])
        } else {
          setError('Failed to fetch movies')
        }
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError('Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Get unique genres and years from movies
  const genres = ['all', ...Array.from(new Set(movies.map(movie => movie.genre).flat()))]
  const years = ['all', ...Array.from(new Set(movies.map(movie => movie.year))).sort((a, b) => b - a)]

  // Filter movies based on search and filters
  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || (movie.genre && movie.genre.includes(selectedGenre))
    const matchesYear = selectedYear === 'all' || movie.year.toString() === selectedYear
    
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
            <span className="bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
              Fîlmên Kurdî
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Fîlmên herî baş û nû yên kurdî yên ku tu dixwazî bibînî
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
                placeholder="Fîlmeke lêbigere..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
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
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                    className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
              {filteredMovies.length} fîlm hat dîtin
            </div>
          </motion.div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <h3 className="text-2xl font-bold text-slate-400 mb-4">
                Fîlmên yên dîtin
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
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300 group hover:scale-105"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-700/50 flex items-center justify-center">
                    <Play className="w-16 h-16 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Genre Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-full font-medium">
                        {movie.genre}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors duration-300">
                      {movie.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {movie.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-slate-300">{movie.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-slate-300">{movie.rating}</span>
                        </div>
                      </div>
                      <span className="text-slate-400">{movie.year}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2">
                        <Play className="w-4 h-4" />
                        Temaşe Bike
                      </button>
                      <button className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg transition-all duration-200">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                Fîlm hat dîtin
              </h3>
              <p className="text-slate-500 mb-8">
                Ji kerema xwe pêşniyareke din lêbigere an jî filtreyan guherîne
              </p>
              <button 
                onClick={clearFilters}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Hemû Fîlmên Bibîne
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
