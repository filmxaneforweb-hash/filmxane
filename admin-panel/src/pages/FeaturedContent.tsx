import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Star, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit, 
  Play,
  Clock,
  Users,
  AlertTriangle,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreVertical,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  genre: string[]
  views: number
  rating: number
  isFeatured: boolean
  isHidden: boolean
  uploadedAt: string
  director: string
}

const FeaturedContent: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showHideModal, setShowHideModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'featured' | 'hidden'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'title' | 'views' | 'rating' | 'uploadedAt'>('uploadedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/videos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (error) {
      console.error('Failed to load videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFeatured = async (videoId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/toggle-featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        },
        body: JSON.stringify({ isFeatured: !currentStatus })
      })
      
      if (response.ok) {
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { ...video, isFeatured: !currentStatus }
            : video
        ))
        alert(currentStatus ? 'Video featured listesinden çıkarıldı' : 'Video featured listesine eklendi')
      }
    } catch (error) {
      console.error('Failed to toggle featured:', error)
      alert('İşlem başarısız oldu')
    }
  }

  const toggleHidden = async (videoId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}/toggle-hidden`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        },
        body: JSON.stringify({ isHidden: !currentStatus })
      })
      
      if (response.ok) {
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { ...video, isHidden: !currentStatus }
            : video
        ))
        alert(currentStatus ? 'Video gizlilikten çıkarıldı' : 'Video gizlendi')
      }
    } catch (error) {
      console.error('Failed to toggle hidden:', error)
      alert('İşlem başarısız oldu')
    }
  }

  const deleteVideo = async (videoId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        }
      })
      
      if (response.ok) {
        setVideos(prev => prev.filter(video => video.id !== videoId))
        setShowDeleteModal(false)
        setSelectedVideo(null)
        alert('Video başarıyla silindi')
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('Video silinemedi')
    }
  }

  const formatDuration = (seconds: number) => {
    // Float değerleri yuvarla ve negatif değerleri kontrol et
    const safeSeconds = Math.max(0, Math.round(seconds))
    
    const hours = Math.floor(safeSeconds / 3600)
    const minutes = Math.floor((safeSeconds % 3600) / 60)
    const secs = safeSeconds % 60
    
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredAndSortedVideos = videos
    .filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      if (filterType === 'featured') return matchesSearch && video.isFeatured
      if (filterType === 'hidden') return matchesSearch && video.isHidden
      return matchesSearch
    })
    .sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'views':
          aValue = a.views
          bValue = b.views
          break
        case 'rating':
          aValue = a.rating
          bValue = b.rating
          break
        case 'uploadedAt':
          aValue = new Date(a.uploadedAt)
          bValue = new Date(b.uploadedAt)
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Videolar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">
              Featured Content Yönetimi
            </h1>
            <p className="text-blue-100 text-lg">
              Ana sayfada görünen videoları yönetin ve içerik kalitesini artırın
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <div className="text-3xl font-bold">{filteredAndSortedVideos.length}</div>
              <div className="text-blue-100">Toplam Video</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Search, Filters and Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Video ara... (başlık, açıklama)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                filterType === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              Tümü
            </button>
            <button
              onClick={() => setFilterType('featured')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                filterType === 'featured'
                  ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/25'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Star className="w-4 h-4" />
              Featured
            </button>
            <button
              onClick={() => setFilterType('hidden')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                filterType === 'hidden'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              Gizli
            </button>
          </div>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sırala:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="uploadedAt">Yükleme Tarihi</option>
              <option value="title">Başlık</option>
              <option value="views">İzlenme</option>
              <option value="rating">Puan</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Görünüm:</span>
            <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Videos Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Enhanced Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatDuration(video.duration)}</span>
                        </div>
                        <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200">
                          <Play className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {video.isFeatured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs rounded-full font-bold shadow-lg flex items-center gap-1"
                      >
                        <Star className="w-3 h-3" />
                        Featured
                      </motion.span>
                    )}
                    {video.isHidden && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs rounded-full font-bold shadow-lg flex items-center gap-1"
                      >
                        <EyeOff className="w-3 h-3" />
                        Gizli
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {video.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{video.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{video.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFeatured(video.id, video.isFeatured)}
                      className={`flex-1 px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        video.isFeatured
                          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 shadow-lg shadow-yellow-500/25'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {video.isFeatured ? 'Featured Çıkar' : 'Featured Yap'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedVideo(video)
                        setShowHideModal(true)
                      }}
                      className={`px-3 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        video.isHidden
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg shadow-green-500/25'
                          : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
                      }`}
                    >
                      {video.isHidden ? 'Göster' : 'Gizle'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedVideo(video)
                        setShowDeleteModal(true)
                      }}
                      className="px-3 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredAndSortedVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ x: 8 }}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-6">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {video.title}
                      </h3>
                      <div className="flex gap-2">
                        {video.isFeatured && (
                          <span className="px-2 py-1 bg-yellow-500 text-black text-xs rounded-full font-bold">
                            <Star className="w-3 h-3 inline mr-1" />
                            Featured
                          </span>
                        )}
                        {video.isHidden && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                            <EyeOff className="w-3 h-3 inline mr-1" />
                            Gizli
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {video.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{video.views.toLocaleString()} izlenme</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{video.rating.toFixed(1)} puan</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(video.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleFeatured(video.id, video.isFeatured)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        video.isFeatured
                          ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {video.isFeatured ? 'Featured Çıkar' : 'Featured Yap'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedVideo(video)
                        setShowHideModal(true)
                      }}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        video.isHidden
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-orange-600 text-white hover:bg-orange-700'
                      }`}
                    >
                      {video.isHidden ? 'Göster' : 'Gizle'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedVideo(video)
                        setShowDeleteModal(true)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Enhanced Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Video Sil
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                <strong className="text-red-600 dark:text-red-400">{selectedVideo.title}</strong> videosunu silmek istediğinizden emin misiniz? 
                Bu işlem geri alınamaz.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={() => deleteVideo(selectedVideo.id)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all duration-200"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Hide/Show Confirmation Modal */}
      <AnimatePresence>
        {showHideModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-2xl ${
                  selectedVideo.isHidden 
                    ? 'bg-green-100 dark:bg-green-900/20' 
                    : 'bg-orange-100 dark:bg-orange-900/20'
                }`}>
                  {selectedVideo.isHidden ? (
                    <Eye className="w-8 h-8 text-green-600 dark:text-green-400" />
                  ) : (
                    <EyeOff className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedVideo.isHidden ? 'Video Göster' : 'Video Gizle'}
                </h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg leading-relaxed">
                <strong className="text-blue-600 dark:text-blue-400">{selectedVideo.title}</strong> videosunu 
                {selectedVideo.isHidden ? ' göstermek' : ' gizlemek'} istediğinizden emin misiniz?
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowHideModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    toggleHidden(selectedVideo.id, selectedVideo.isHidden)
                    setShowHideModal(false)
                  }}
                  className={`flex-1 px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-200 ${
                    selectedVideo.isHidden
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-green-500/25'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-500/25'
                  }`}
                >
                  {selectedVideo.isHidden ? 'Göster' : 'Gizle'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FeaturedContent
