import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  Play, 
  Users, 
  Eye, 
  TrendingUp, 
  Plus,
  Star,
  Activity,
  Clock,
  X,
  Upload,
  Film,
  Tv
} from 'lucide-react'
import { useWebSocket } from '../hooks/useWebSocket'
import { 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

interface VideoUploadData {
  title: string
  description: string
  genre: string[]
  year: number
  rating: number
  duration: number
  type: 'movie' | 'series'
  episodeNumber?: number
  seasonNumber?: number
  seriesId?: string
  isFeatured: boolean
  isNew: boolean
}

interface ChartDataItem {
  name: string
  views: number
  users: number
  movies: number
}

interface PieDataItem {
  name: string
  value: number
  color: string
}

interface ActivityItem {
  id: string | number
  action: string
  content: string
  time: string
  type: string
  status: string
}

interface ContentItem {
  id: string | number
  title: string
  type: string
  views: string
  rating: number
  thumbnail: string
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState<VideoUploadData>({
    title: '',
    description: '',
    genre: [],
    year: new Date().getFullYear(),
    rating: 0,
    duration: 0,
    type: 'movie',
    isFeatured: false,
    isNew: false
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [stats, setStats] = useState({
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    totalViews: 0,
    totalRevenue: 0,
    activeUsers: 0
  })

  const [chartData, setChartData] = useState<ChartDataItem[]>([])
  const [pieData, setPieData] = useState<PieDataItem[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [topContent, setTopContent] = useState<ContentItem[]>([])
  const [genres, setGenres] = useState<string[]>([])

  const statCards = [
    {
      title: 'Hemû Fîlm',
      value: stats.totalMovies,
      icon: Play,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Hemû Rêzefîlm',
      value: stats.totalSeries,
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Hemû Bikarhêner',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Hemû Temaşe',
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      color: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ]

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [statsRes, chartRes, pieRes, activitiesRes, contentRes, genresRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/stats`),
          fetch(`${API_BASE_URL}/admin/chart-data`),
          fetch(`${API_BASE_URL}/admin/pie-data`),
          fetch(`${API_BASE_URL}/admin/recent-activities`),
          fetch(`${API_BASE_URL}/admin/top-content`),
          fetch(`${API_BASE_URL}/admin/genres`)
        ])

        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }

        if (chartRes.ok) {
          const chartData = await chartRes.json()
          setChartData(chartData)
        }

        if (pieRes.ok) {
          const pieData = await pieRes.json()
          setPieData(pieData)
        }

        if (activitiesRes.ok) {
          const activitiesData = await activitiesRes.json()
          setRecentActivity(activitiesData)
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json()
          setTopContent(contentData)
        }

        if (genresRes.ok) {
          const genresData = await genresRes.json()
          setGenres(genresData)
        }
      } catch (e) {
        console.error('Failed to load admin data', e)
      } finally {
        setIsLoading(false)
      }
    }
    loadAllData()
  }, [])

  const handleWebSocketMessage = (message: { type: string; data: any }) => {
    switch (message.type) {
      case 'videoAdded':
        // Gava vîdyoyeke nû hat zêdekirin, panela birêveberiyê nû bike
        setStats(prev => ({
          ...prev,
          totalMovies: prev.totalMovies + 1
        }));
        break;
        
      case 'seriesAdded':
        // Gava rêzefîlmeke nû hat zêdekirin, panela birêveberiyê nû bike
        setStats(prev => ({
          ...prev,
          totalSeries: prev.totalSeries + 1
        }));
        break;
        
      case 'statsUpdated':
        // Gava statîstîk nû bûn
        setStats(message.data);
        break;
        
      case 'userAdded':
        // Gava bikarhênerek nû hat zêdekirin
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers + 1
        }));
        break;
    }
  };

  useWebSocket(handleWebSocketMessage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'video') {
        setVideoFile(file)
      } else {
        setThumbnailFile(file)
      }
    }
  }

  const handleGenreToggle = (genre: string) => {
    setUploadData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre) 
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }))
  }

  const handleUpload = async () => {
    if (!videoFile) {
      alert('Ji kerema xwe vîdyoyeke hilbijêre')
      return
    }
    
    // Validate required fields
    if (!uploadData.title.trim()) {
      alert('Ji kerema xwe navê vîdyoyê binivîse')
      return
    }
    
    if (!uploadData.description.trim()) {
      alert('Ji kerema xwe daxûyaniya vîdyoyê binivîse')
      return
    }
    
    if (uploadData.duration <= 0) {
      alert('Ji kerema xwe dirêjahiya vîdyoyê binivîse')
      return
    }
    
    if (uploadData.year <= 0) {
      alert('Ji kerema xwe sala vîdyoyê binivîse')
      return
    }
    
    // Check if genre is selected
    if (uploadData.genre.length === 0) {
      alert('Ji kerema xwe cureyeke fîlmê hilbijêre')
      return
    }
    
    // Log form data for debugging
    console.log('✅ Form validation passed');
    console.log('📝 Form data:', {
      title: uploadData.title,
      description: uploadData.description,
      duration: uploadData.duration,
      year: uploadData.year,
      type: uploadData.type,
      genre: uploadData.genre,
      rating: uploadData.rating,
      isFeatured: uploadData.isFeatured,
      isNew: uploadData.isNew
    });

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      
      // Add video file
      formData.append('files', videoFile)
      
      // Add thumbnail if selected
      if (thumbnailFile) {
        formData.append('files', thumbnailFile)
      }
      
      // Add video data
      console.log('📝 Adding form data:')
      
      // Add each field with proper type conversion
      formData.append('title', uploadData.title)
      formData.append('description', uploadData.description)
      
      // Add each genre separately to create an array
      uploadData.genre.forEach(genre => {
        formData.append('genre', genre)
      })
      
      formData.append('year', String(Number(uploadData.year)))
      formData.append('rating', String(Number(uploadData.rating)))
      formData.append('duration', String(Number(uploadData.duration)))
      formData.append('type', uploadData.type)
      formData.append('isFeatured', String(Boolean(uploadData.isFeatured)))
      formData.append('isNew', String(Boolean(uploadData.isNew)))
      
      // Add optional fields if they exist
      if (uploadData.episodeNumber) {
        formData.append('episodeNumber', uploadData.episodeNumber.toString())
      }
      if (uploadData.seasonNumber) {
        formData.append('seasonNumber', uploadData.seasonNumber.toString())
      }
      if (uploadData.seriesId) {
        formData.append('seriesId', uploadData.seriesId)
      }
      
      console.log('📝 Form data added:')
      console.log('  title:', uploadData.title)
      console.log('  description:', uploadData.description)
      console.log('  genre:', uploadData.genre, 'type:', typeof uploadData.genre, 'length:', uploadData.genre.length)
      console.log('  year:', uploadData.year, 'type:', typeof uploadData.year)
      console.log('  rating:', uploadData.rating, 'type:', typeof uploadData.rating)
      console.log('  duration:', uploadData.duration, 'type:', typeof uploadData.duration)
      console.log('  type:', uploadData.type)
      console.log('  isFeatured:', uploadData.isFeatured, 'type:', typeof uploadData.isFeatured)
      console.log('  isNew:', uploadData.isNew, 'type:', typeof uploadData.isNew)
      
      // Log FormData contents
      console.log('📋 FormData contents:')
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value)
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Make API call
      const response = await fetch(`${API_BASE_URL}/admin/videos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Upload failed with status:', response.status)
        console.error('❌ Error response:', errorText)
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ Video upload successful:', result)

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Show success message
      alert(`🎬 "${uploadData.title}" başarıyla yüklendi!\n\nFilm web sitene yönlendiriliyorsun...`)

      // Reset form
      setShowUploadModal(false)
      setUploadData({
        title: '',
        description: '',
        genre: [],
        year: new Date().getFullYear(),
        rating: 0,
        duration: 0,
        type: 'movie',
        isFeatured: false,
        isNew: false
      })
      setVideoFile(null)
      setThumbnailFile(null)
      setUploadProgress(0)
      setIsUploading(false)
      
      // Navigate to film web site instead of admin movies page
      setTimeout(() => {
        // Film web sitene yönlendir (frontend - port 3000)
        console.log('🚀 Redirecting to film website...')
        window.location.href = 'http://localhost:3000/movies'
      }, 2000)

    } catch (error) {
      console.error('❌ Upload error:', error)
      
      let errorMessage = 'Upload failed. Please try again.'
      if (error instanceof Error && error.message && error.message.includes('Upload failed:')) {
        errorMessage = error.message.replace('Upload failed:', 'Upload failed:').trim()
      }
      
      alert(`❌ ${errorMessage}`)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
      {/* Serê Rûpelê */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Panela Birêveberiyê
        </h1>
          <p className="text-gray-600 dark:text-gray-400">
          Bi xêr hatî! Ev e ku îro di Filmxane de dibe.
        </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUploadModal(true)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Naverok Zêde Bike</span>
        </motion.button>
      </motion.div>

      {/* Grida Statîstîkan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} dark:bg-gray-700 p-3 rounded-xl`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('from-','text-').split(' ')[0]}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Beşa Grafikên */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Grafikên Temaşeyan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Temaşeyên Giştî</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Belavbûna Naverokê */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Belavbûna Naverokê</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Naverok û Çalakî */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Naveroka Herî Baş */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Naveroka Herî Baş</h3>
            <Play className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="text-2xl">{content.thumbnail}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{content.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{content.type}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-sm font-medium">{content.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{content.views} temaşe</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Çalakiyên Dawî */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Çalakiyên Dawî</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'info' ? 'bg-blue-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.content}</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modala Barkirina Vîdyoyê */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
        <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Serê Modalê */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Naveroka Nû Barkir</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
          </div>

              {/* Naveroka Modalê */}
              <div className="p-6 space-y-6">
                {/* Hilbijartina Cureya Naverokê */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cureya Naverokê
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUploadData(prev => ({ ...prev, type: 'movie' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        uploadData.type === 'movie'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      Fîlm
                    </button>
                    <button
                      onClick={() => setUploadData(prev => ({ ...prev, type: 'series' }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        uploadData.type === 'series'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <Tv className="w-4 h-4" />
                      Rêzefîlm
            </button>
                  </div>
                </div>

                {/* Agahiyên Bingehîn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nav
                    </label>
                    <input
                      type="text"
                      value={uploadData.title}
                      onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Mînak: The Matrix, Avatar, Titanic..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sal
                    </label>
                    <input
                      type="number"
                      value={uploadData.year}
                      onChange={(e) => setUploadData(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      placeholder="2024"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Daxuyanî
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Fîlm çi derbarê ye? Çîroka wê çi ye?..."
                    required
                  />
                </div>

                {/* Qadanên Taybet ji bo Rêzefîlman */}
                {uploadData.type === 'series' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hejmara Sezonê
                      </label>
                      <input
                        type="number"
                        value={uploadData.seasonNumber || ''}
                        onChange={(e) => setUploadData(prev => ({ ...prev, seasonNumber: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hejmara Epîzodê
                      </label>
                      <input
                        type="number"
                        value={uploadData.episodeNumber || ''}
                        onChange={(e) => setUploadData(prev => ({ ...prev, episodeNumber: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                {/* Dirêjahî û Pûan */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dirêjahî (deqîqe)
                    </label>
                    <input
                      type="number"
                      value={uploadData.duration}
                      onChange={(e) => setUploadData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="1"
                      placeholder="120 (deqîqe)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pûan
                    </label>
                    <input
                      type="number"
                      value={uploadData.rating}
                      onChange={(e) => setUploadData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      max="10"
                      step="0.1"
                      placeholder="4.5 (0-10 arası)"
                    />
                  </div>
                </div>

                {/* Cureyên Fîlman */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cureyên Fîlman *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.length > 0 ? (
                      genres.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                            uploadData.genre.includes(genre)
                              ? 'bg-blue-500 text-white border-blue-600'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {genre}
                        </button>
                      ))
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400 text-sm">
                        Genre'lar yükleniyor... Eğer genre'lar yüklenmiyorsa, lütfen sayfayı yenile.
                      </div>
                    )}
                  </div>
                  {uploadData.genre.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      ✅ Seçilen: {uploadData.genre.join(', ')}
                    </div>
                  )}
                  {uploadData.genre.length === 0 && genres.length > 0 && (
                    <div className="mt-2 text-sm text-red-500 dark:text-red-400">
                      ⚠️ En az bir genre seçmelisin!
                    </div>
                  )}
                </div>

                {/* Barkirina Pelê */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pela Vîdyoyê *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {videoFile ? videoFile.name : 'Ji bo barkirina pela vîdyoyê tik bike'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          MP4, AVI, MOV, MKV, WebM, M4V, FLV, WMV (Max 5GB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wêneyê Biçûk (Ne Meçburî)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="hidden"
                        id="thumbnail-upload"
                      />
                      <label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {thumbnailFile ? thumbnailFile.name : 'Ji bo barkirina wêneyê biçûk tik bike'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          JPG, PNG, GIF (Max 10MB)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Vebijark */}
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uploadData.isFeatured}
                      onChange={(e) => setUploadData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Naveroka Taybet</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={uploadData.isNew}
                      onChange={(e) => setUploadData(prev => ({ ...prev, isNew: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Nû Hat</span>
                  </label>
                </div>

                {/* Pêşketina Barkirinê */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Barkirin...</span>
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

                {/* Butonên Çalakiyê */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Betal
            </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading || !videoFile || !uploadData.title || !uploadData.description}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Barkirin...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Naverok Barkir
                      </>
                    )}
            </button>
          </div>
              </div>
            </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dashboard
