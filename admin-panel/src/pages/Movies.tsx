import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Star,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Clock,
  Film,
  X,
  Upload,
  FileVideo,
  Image
} from 'lucide-react'
import { useWebSocket } from '../hooks/useWebSocket'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005/api'

interface Movie {
  id: number
  title: string
  description: string
  thumbnail: string
  genre: string[]
  year: number
  rating: number
  duration: number
  views: number
  isFeatured: boolean
  isNew: boolean
}

interface CreateMovieForm {
  title: string
  description: string
  genre: string[]
  year: number
  duration: number
  isFeatured: boolean
  isNew: boolean
}

const Movies: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const genres = ['hemû', 'drama', 'komedî', 'çalakî', 'evîn', 'tirs', 'zanistî', 'xeyalî']

  const [movies, setMovies] = useState<Movie[]>([])
  const [movieStats, setMovieStats] = useState({
    total: 0,
    featured: 0,
    new: 0,
    totalViews: 0
  })

  const [formData, setFormData] = useState<CreateMovieForm>({
    title: '',
    description: '',
    genre: [],
    year: new Date().getFullYear(),
    duration: 0,
    isFeatured: false,
    isNew: false
  })

  const [selectedFiles, setSelectedFiles] = useState<{
    video?: File
    thumbnail?: File
  }>({})

  useEffect(() => {
    loadMovies()
    loadMovieStats()
  }, [])

  const handleWebSocketMessage = (message: { type: string; data: any }) => {
    switch (message.type) {
      case 'videoAdded':
        // Gava vîdyoyeke nû hat zêdekirin, lîsteyê nû bike
        setMovies(prev => [message.data, ...prev]);
        // Statîstîkên jî nû bike
        loadMovieStats();
        break;
        
      case 'statsUpdated':
        // Gava statîstîk nû bûn
        setMovieStats(message.data);
        break;
    }
  };

  useWebSocket(handleWebSocketMessage);

  const loadMovies = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/movies`)
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
      }
    } catch (error) {
      console.error('Fîlm nehatin barkirin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMovieStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/movies/stats`)
      if (response.ok) {
        const data = await response.json()
        setMovieStats(data)
      }
    } catch (error) {
      console.error('Statîstîkên fîlman nehatin barkirin:', error)
    }
  }

  const handleFileSelect = (type: 'video' | 'thumbnail', file: File) => {
    setSelectedFiles(prev => ({
      ...prev,
      [type]: file
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFiles.video) {
      alert('Please select a video file')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('genre', JSON.stringify(formData.genre))
      formDataToSend.append('year', formData.year.toString())
      formDataToSend.append('duration', formData.duration.toString())
      formDataToSend.append('isFeatured', formData.isFeatured.toString())
      formDataToSend.append('isNew', formData.isNew.toString())
      
      // Add files
      if (selectedFiles.video) {
        formDataToSend.append('files', selectedFiles.video)
        console.log('Video file added:', selectedFiles.video.name, selectedFiles.video.size, selectedFiles.video.type)
      }
      if (selectedFiles.thumbnail) {
        formDataToSend.append('files', selectedFiles.thumbnail)
        console.log('Thumbnail file added:', selectedFiles.thumbnail.name, selectedFiles.thumbnail.size, selectedFiles.thumbnail.type)
      }

      const token = localStorage.getItem('filmxane_admin_token')
      console.log('Using API URL:', API_BASE_URL)
      console.log('Using token:', token ? 'Token exists' : 'No token')
      
      console.log('FormData contents:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value)
      }
      
      const response = await fetch(`${API_BASE_URL}/admin/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        const newMovie = await response.json()
        console.log('Upload successful:', newMovie)
        setMovies(prev => [newMovie, ...prev])
        setShowAddModal(false)
        resetForm()
        alert('Movie added successfully!')
      } else {
        const error = await response.json()
        console.error('Upload failed with status:', response.status, 'Error:', error)
        alert(`Upload failed: ${error.message || 'Please try again'}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      genre: [],
      year: new Date().getFullYear(),
      duration: 0,
      isFeatured: false,
      isNew: false
    })
    setSelectedFiles({})
  }

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }))
  }

  const stats = movieStats

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         movie.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || movie.genre.includes(selectedGenre)
    
    return matchesSearch && matchesGenre
  })

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-80 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Birêvebirina Fîlman</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hemû fîlmên di pirtûkxaneya Filmxane de birêvebire</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Fîlmeke Nû Zêde Bike
        </motion.button>

      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Hemû Fîlm', value: stats.total, icon: Play, color: 'from-blue-500 to-blue-600' },
          { label: 'Taybet', value: stats.featured, icon: Star, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Nû Hat', value: stats.new, icon: TrendingUp, color: 'from-green-500 to-green-600' },
          { label: 'Hemû Temaşe', value: stats.totalViews.toLocaleString(), icon: Users, color: 'from-purple-500 to-purple-600' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Fîlmek bi navê bigere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            />
          </div>
          <div className="flex gap-3 items-center">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'Hemû Cure' : genre}
                </option>
              ))}
            </select>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="grid grid-cols-2 gap-1 w-4 h-4">
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <div className="space-y-1 w-4 h-4">
                  <div className="w-full h-1.5 bg-current rounded-sm"></div>
                  <div className="w-full h-1.5 bg-current rounded-sm"></div>
                  <div className="w-full h-1.5 bg-current rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Movies Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {movie.isFeatured && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-medium rounded-full shadow-lg"
                      >
                        Featured
                      </motion.span>
                    )}
                    {movie.isNew && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-full shadow-lg"
                      >
                        New
                      </motion.span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                    >
                      <Film className="w-5 h-5 ml-0.5" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {movie.title}
                    </h3>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{movie.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{movie.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{movie.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{movie.duration}min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      {movie.genre.slice(0, 2).map(genre => (
                        <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{movie.views.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-6">
                  <div className="relative w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-1">{movie.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{movie.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {movie.isFeatured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                        {movie.isNew && (
                          <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{movie.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{movie.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{movie.duration}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{movie.views.toLocaleString()} views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {movie.genre.map(genre => (
                          <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                            {genre}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4 inline mr-2" />
                          View
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-colors font-medium"
                        >
                          <Edit className="w-4 h-4 inline mr-2" />
                          Edit
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
                        >
                          <Trash2 className="w-4 h-4 inline mr-2" />
                          Delete
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {filteredMovies.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <Search className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No movies found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}

      {/* Add Movie Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Movie</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title & Description */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Movie Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter movie title..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Enter movie description..."
                    />
                  </div>
                </div>

                {/* Year & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Genres */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Genres
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.filter(g => g !== 'hemû').map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleGenreToggle(genre)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          formData.genre.includes(genre)
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Movie</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Release</span>
                  </label>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Video File * <span className="text-red-500">(MP4, AVI, MOV, MKV - Max 100MB)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect('video', e.target.files[0])}
                        className="hidden"
                        id="video-upload"
                        required
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        {selectedFiles.video ? (
                          <div className="flex items-center gap-3 text-green-600">
                            <FileVideo className="w-8 h-8" />
                            <span className="font-medium">{selectedFiles.video.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400">Click to upload video file</p>
                            <p className="text-sm text-gray-500">or drag and drop</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Thumbnail Image <span className="text-gray-500">(Optional - JPG, PNG, GIF)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleFileSelect('thumbnail', e.target.files[0])}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload" className="cursor-pointer">
                        {selectedFiles.thumbnail ? (
                          <div className="flex items-center gap-3 text-green-600">
                            <Image className="w-8 h-8" />
                            <span className="font-medium">{selectedFiles.thumbnail.name}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="text-gray-600 dark:text-gray-400">Click to upload thumbnail</p>
                            <p className="text-sm text-gray-500">or drag and drop</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? 'Uploading...' : 'Add Movie'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Movies
