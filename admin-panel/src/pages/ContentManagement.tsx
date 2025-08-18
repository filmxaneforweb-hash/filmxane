import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Tv,
  Trash2,
  Edit3,
  Crown,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface ContentStats {
  totalMovies: number
  totalSeries: number
  totalUsers: number
  totalViews: number
  premiumUsers: number
  featuredContent: number
  newContent: number
}

interface ContentItem {
  id: string
  title: string
  type: 'movie' | 'series'
  thumbnail: string
  views: number
  rating: number
  isFeatured: boolean
  isNew: boolean
  createdAt: string
  genre: string[]
  status: 'published' | 'hidden' // Added status for visibility toggle
}

interface UserStats {
  total: number
  premium: number
  basic: number
  active: number
  verified: number
}

const ContentManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [contentStats, setContentStats] = useState<ContentStats>({
    totalMovies: 0,
    totalSeries: 0,
    totalUsers: 0,
    totalViews: 0,
    premiumUsers: 0,
    featuredContent: 0,
    newContent: 0
  })
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    premium: 0,
    basic: 0,
    active: 0,
    verified: 0
  })
  const [contentList, setContentList] = useState<ContentItem[]>([])
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showFeatureModal, setShowFeatureModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'series'>('all')


  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        console.error('No admin token found')
        return
      }

      const [statsRes, userStatsRes, contentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/admin/users/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_BASE_URL}/admin/content/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setContentStats(prev => ({
          ...prev,
          ...statsData
        }))
      } else {
        console.error('Failed to load stats:', statsRes.status)
      }

      if (userStatsRes.ok) {
        const userStatsData = await userStatsRes.json()
        setUserStats(userStatsData)
        setContentStats(prev => ({
          ...prev,
          premiumUsers: userStatsData.premium
        }))
      } else {
        console.error('Failed to load user stats:', userStatsRes.status)
      }

      if (contentRes.ok) {
        const contentData = await contentRes.json()
        setContentList(contentData)
      } else {
        console.error('Failed to load content:', contentRes.status)
      }
    } catch (error) {
      console.error('Failed to load content management data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteContent = async () => {
    if (!selectedContent) return

    setIsProcessing(true)
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        alert('Ji kerema xwe dîsa têkeve')
        return
      }

      const response = await fetch(`${API_BASE_URL}/admin/content/${selectedContent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        // Remove from list and update stats
        setContentList(prev => prev.filter(item => item.id !== selectedContent.id))
        setContentStats(prev => ({
          ...prev,
          totalMovies: selectedContent.type === 'movie' ? prev.totalMovies - 1 : prev.totalMovies,
          totalSeries: selectedContent.type === 'series' ? prev.totalSeries - 1 : prev.totalSeries
        }))
        setShowDeleteModal(false)
        setSelectedContent(null)
        
        // Show success message
        alert(`${selectedContent.title} ji sîstemê hat jêbirin`)
      } else {
        const errorData = await response.json()
        alert(`Çewtiyek çêbû: ${errorData.message || 'Failed to delete content'}`)
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
      alert('Çewtiyek çêbû, ji kerema xwe dîsa biceribîne')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleFeature = async (contentId: string, isFeatured: boolean) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        alert('Ji kerema xwe dîsa têkeve')
        return
      }

      const response = await fetch(`${API_BASE_URL}/admin/content/${contentId}/feature`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeatured: !isFeatured })
      })

      if (response.ok) {
        // Update local state
        setContentList(prev => prev.map(item => 
          item.id === contentId ? { ...item, isFeatured: !isFeatured } : item
        ))
        setContentStats(prev => ({
          ...prev,
          featuredContent: isFeatured ? prev.featuredContent - 1 : prev.featuredContent + 1
        }))
        setShowFeatureModal(false)
        setSelectedContent(null)
        
        // Show success message
        const newStatus = isFeatured ? 'ji taybetiyê hat derxistin' : 'hat taybetkirin'
        alert(`${selectedContent?.title} ${newStatus}`)
      } else {
        const errorData = await response.json()
        alert(`Çewtiyek çêbû: ${errorData.message || 'Failed to toggle feature status'}`)
      }
    } catch (error) {
      console.error('Failed to toggle feature status:', error)
      alert('Çewtiyek çêbû, ji kerema xwe dîsa biceribîne')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleToggleVisibility = async (contentId: string) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        alert('Ji kerema xwe dîsa têkeve')
        return
      }

      // Find current content to get current status
      const currentContent = contentList.find(item => item.id === contentId)
      if (!currentContent) {
        alert('Naverok nehat dîtin')
        return
      }

      // Toggle between 'published' and 'hidden' status
      const newStatus = currentContent.status === 'published' ? 'hidden' : 'published'

      const response = await fetch(`${API_BASE_URL}/admin/content/${contentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Update local state
        setContentList(prev => prev.map(item => 
          item.id === contentId ? { ...item, status: newStatus } : item
        ))
        
        // Show success message
        const statusText = newStatus === 'published' ? 'hat xuya kirin' : 'hat veşartin'
        alert(`${currentContent.title} ${statusText}`)
      } else {
        const errorData = await response.json()
        alert(`Çewtiyek çêbû: ${errorData.message || 'Failed to update content status'}`)
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
      alert('Çewtiyek çêbû, ji kerema xwe dîsa biceribîne')
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredContent = contentList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const statCards = [
    {
      title: 'Hemû Fîlm',
      value: contentStats.totalMovies,
      icon: Film,
      color: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Hemû Rêzefîlm',
      value: contentStats.totalSeries,
      icon: Tv,
      color: 'from-green-500 to-green-600',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Premium Bikarhêner',
      value: contentStats.premiumUsers,
      icon: Crown,
      color: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Naveroka Taybet',
      value: contentStats.featuredContent,
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ]

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Birêvebirina Naverokê
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fîlm û rêzefîlman birêvebirin û statîstîkên bikarhêneran bibînin
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
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
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Statîstîkên Bikarhêneran</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{userStats.total}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Hemû</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{userStats.premium}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Premium</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{userStats.basic}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bingehîn</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{userStats.active}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Çalak</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">{userStats.verified}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Piştrast</p>
          </div>
        </div>
      </motion.div>

      {/* Content Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Birêvebirina Naverokê</h3>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Lêgerîn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">Hemû Cure</option>
              <option value="movie">Fîlm</option>
              <option value="series">Rêzefîlm</option>
            </select>

          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Naverok</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Cure</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Temaşe</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Pûan</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Rewş</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Çalakî</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gray-200 dark:bg-gray-600 rounded overflow-hidden">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            {item.type === 'movie' ? <Film className="w-4 h-4" /> : <Tv className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'movie' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                      {item.type === 'movie' ? 'Fîlm' : 'Rêzefîlm'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {item.views.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-900 dark:text-white">{item.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {item.status === 'published' ? 'Xuya' : 'Veşartî'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleVisibility(item.id)}
                        disabled={isProcessing}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Rewşa naverokê biguherîne"
                      >
                        {item.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContent(item)
                          setShowFeatureModal(true)
                        }}
                        disabled={isProcessing}
                        className={`p-2 rounded-lg transition-colors ${
                          item.isFeatured
                            ? 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                        }`}
                        title={item.isFeatured ? 'Ji taybetiyê derxe' : 'Taybet bike'}
                      >
                        <Star className={`w-4 h-4 ${item.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContent(item)
                          setShowDeleteModal(true)
                        }}
                        disabled={isProcessing}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Jê bibe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Naverok tune ye
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedContent && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Naverok Jê Bibe</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ev çalakî nayê betalkirin</p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Tu dixwazî <strong>"{selectedContent.title}"</strong> jê bibî? Ev naverok dê ji sîstemê were jêbirin.
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Betal
                  </button>
                  <button
                    onClick={handleDeleteContent}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Tê jêbirin...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Jê Bibe
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feature Toggle Modal */}
      <AnimatePresence>
        {showFeatureModal && selectedContent && (
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedContent.isFeatured 
                      ? 'bg-yellow-100 dark:bg-yellow-900/20' 
                      : 'bg-blue-100 dark:bg-blue-900/20'
                  }`}>
                    {selectedContent.isFeatured ? (
                      <Star className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedContent.isFeatured ? 'Ji Taybetiyê Derxe' : 'Taybet Bike'}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedContent.isFeatured 
                        ? 'Ev naverok dê ji beşa taybet were derxistin' 
                        : 'Ev naverok dê di beşa taybet de were xuyang'
                      }
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Tu dixwazî <strong>"{selectedContent.title}"</strong> 
                  {selectedContent.isFeatured ? ' ji taybetiyê derxî?' : ' taybet bikî?'}
                </p>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowFeatureModal(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Betal
                  </button>
                  <button
                    onClick={() => handleToggleFeature(selectedContent.id, selectedContent.isFeatured)}
                    disabled={isProcessing}
                    className={`flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 ${
                      selectedContent.isFeatured 
                        ? 'bg-yellow-600 hover:bg-yellow-700' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Tê çêkirin...
                      </>
                    ) : (
                      <>
                        {selectedContent.isFeatured ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {selectedContent.isFeatured ? 'Ji Taybetiyê Derxe' : 'Taybet Bike'}
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

export default ContentManagement
