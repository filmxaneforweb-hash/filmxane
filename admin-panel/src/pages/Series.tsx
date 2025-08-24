import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Film, 
  Tv, 
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
  ListVideo,
  Video
} from 'lucide-react'
import { useWebSocket } from '../hooks/useWebSocket'

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

interface Series {
  id: number
  title: string
  description: string
  thumbnail: string
  genre: string[]
  year: number
  rating: number
  status: string
  seasons: number
  episodes: number
  views: number
  isFeatured: boolean
  isNew: boolean
}

const Series: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

  const genres = ['hemû', 'drama', 'komedî', 'çalakî', 'evîn', 'tirs', 'zanistî', 'xeyalî']
  const statuses = ['hemû', 'berdewam', 'qediyayî', 'betalkirî']

  const [series, setSeries] = useState<Series[]>([])
  const [seriesStats, setSeriesStats] = useState({
    total: 0,
    featured: 0,
    new: 0,
    totalViews: 0,
    totalSeasons: 0,
    totalEpisodes: 0
  })

  useEffect(() => {
    loadSeries()
    loadSeriesStats()
  }, [])

  const handleWebSocketMessage = (message: { type: string; data: any }) => {
    switch (message.type) {
      case 'seriesAdded':
        // Gava rêzefîlmeke nû hat zêdekirin, lîsteyê nû bike
        setSeries(prev => [message.data, ...prev]);
        // Statîstîkên jî nû bike
        loadSeriesStats();
        break;
        
      case 'statsUpdated':
        // Gava statîstîk nû bûn
        setSeriesStats(message.data);
        break;
    }
  };

  useWebSocket(handleWebSocketMessage);

  const loadSeries = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/series`)
      if (response.ok) {
        const data = await response.json()
        setSeries(data)
      }
    } catch (error) {
      console.error('Rêzefîlm nehatin barkirin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSeriesStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/series/stats`)
      if (response.ok) {
        const data = await response.json()
        setSeriesStats(data)
      }
    } catch (error) {
      console.error('Failed to load series stats:', error)
    }
  }

  const stats = seriesStats

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'from-green-500 to-green-600'
      case 'completed': return 'from-blue-500 to-blue-600'
      case 'cancelled': return 'from-red-500 to-red-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'Ongoing'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const filteredSeries = series.filter(series => {
    const matchesSearch = series.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         series.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || series.genre.includes(selectedGenre)
    const matchesStatus = selectedStatus === 'all' || series.status === selectedStatus
    
    return matchesSearch && matchesGenre && matchesStatus
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Birêvebirina Rêzefîlman</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Hemû rêzefîlmên di pirtûkxaneya Filmxane de birêvebire</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h5 mr-2" />
          Rêzefîlmeke Nû Zêde Bike
        </motion.button>

      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {[
          { label: 'Hemû Rêzefîlm', value: stats.total, icon: Tv, color: 'from-green-500 to-green-600' },
          { label: 'Taybet', value: stats.featured, icon: Star, color: 'from-yellow-500 to-yellow-600' },
          { label: 'Nû Hat', value: stats.new, icon: TrendingUp, color: 'from-blue-500 to-blue-600' },
          { label: 'Hemû Temaşe', value: stats.totalViews.toLocaleString(), icon: Users, color: 'from-purple-500 to-purple-600' },
          { label: 'Hemû Sezon', value: stats.totalSeasons, icon: ListVideo, color: 'from-indigo-500 to-indigo-600' },
          { label: 'Hemû Epîzod', value: stats.totalEpisodes, icon: Video, color: 'from-pink-500 to-pink-600' }
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
              placeholder="Rêzefîlmek bi navê bigere..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            />
          </div>
          <div className="flex gap-3 items-center">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'Hemû Cure' : genre}
                </option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'Hemû Rewş' : getStatusText(status)}
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
                    ? 'bg-green-500 text-white' 
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
                    ? 'bg-green-500 text-white' 
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

      {/* Series Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredSeries.map((series, index) => (
              <motion.div
                key={series.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                  <img
                    src={series.thumbnail}
                    alt={series.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    {series.isFeatured && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-medium rounded-full shadow-lg"
                      >
                        Taybet
                      </motion.span>
                    )}
                    {series.isNew && (
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full shadow-lg"
                      >
                        Nû
                      </motion.span>
                    )}
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(series.status)} text-white text-xs font-medium rounded-full shadow-lg`}>
                      {getStatusText(series.status)}
                    </span>
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
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {series.title}
                    </h3>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{series.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{series.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{series.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ListVideo className="w-4 h-4" />
                      <span>{series.seasons}S</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                      {series.genre.slice(0, 2).map(genre => (
                        <span key={genre} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-medium">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Video className="w-4 h-4" />
                      <span>{series.episodes}E</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                      <Eye className="w-4 h-4" />
                      <span>{series.views.toLocaleString()}</span>
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
            {filteredSeries.map((series, index) => (
              <motion.div
                key={series.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-6">
                  <div className="relative w-32 h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={series.thumbnail}
                      alt={series.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-xl mb-1">{series.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{series.description}</p>
                      </div>
                      <div className="flex gap-2">
                        {series.isFeatured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-medium rounded-full">
                            Featured
                          </span>
                        )}
                        {series.isNew && (
                          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium rounded-full">
                            New
                          </span>
                        )}
                        <span className={`px-3 py-1 bg-gradient-to-r ${getStatusColor(series.status)} text-white text-xs font-medium rounded-full`}>
                          {getStatusText(series.status)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{series.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{series.year}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ListVideo className="w-4 h-4" />
                        <span>{series.seasons} Seasons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{series.episodes} Episodes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{series.views.toLocaleString()} views</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {series.genre.map(genre => (
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

      {filteredSeries.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <Tv className="w-20 h-20 mx-auto" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No series found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
        </motion.div>
      )}
    </div>
  )
}

export default Series
