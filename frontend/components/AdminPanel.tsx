'use client'

import { useState, useEffect } from 'react'
// import { div } from 'framer-div' // SSR sorunu nedeniyle kaldÄ±rÄ±ldÄ±
import { 
  Upload, 
  Users, 
  Film, 
  Tv, 
  BarChart3, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Heart,
  TrendingUp,
  Calendar,
  Star,
  X,
  Save
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useContent } from '@/contexts/ContentContext'
import { apiClient } from '@/lib/api'
import { Movie, Series, User } from '@/lib/api'

interface AdminStats {
  totalMovies: number
  totalSeries: number
  totalUsers: number
  totalViews: number
}

export function AdminPanel() {
  const { user } = useAuth()
  const { movies, series, fetchMovies, fetchSeries } = useContent()
  
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)
  const [settingsForm, setSettingsForm] = useState<any>({})
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [chartData, setChartData] = useState<any>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [uploadForm, setUploadForm] = useState({
    title: '',
    titleKurdish: '',
    description: '',
    descriptionKurdish: '',
    year: new Date().getFullYear(),
    genre: [] as string[],
    director: '',
    cast: [] as string[],
    language: [] as string[],
    quality: 'HD' as const,
    contentType: 'movie' as 'movie' | 'series',
    duration: 0,
    rating: 0,
    isFeatured: false,
    isNew: false,
    trailerUrl: '',
    seasonNumber: 0,
    episodeNumber: 0,
    seriesId: '',
    videoFile: null as File | null,
    thumbnailFile: null as File | null,
    subtitleFiles: [] as File[],
    subtitleLanguages: [] as string[],
    subtitleLanguageNames: [] as string[]
  })
  const [availableGenres, setAvailableGenres] = useState<string[]>([
    'Aksiyon', 'Drama', 'Thriller', 'Komedî', 'Romantîk', 
    'Horror', 'Sci-Fi', 'Fantastîk', 'Crime', 'Mystery',
    'Adventure', 'Animation', 'Documentary', 'Biography', 'History'
  ])
  const [availableLanguages] = useState([
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'ku', name: 'Kurdish' },
    { code: 'ar', name: 'العربية' },
    { code: 'fa', name: 'فارسی' }
  ])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [editingContent, setEditingContent] = useState<any>(null)
  const [showEditContentModal, setShowEditContentModal] = useState(false)

  // Fetch functions
    const fetchStats = async () => {
      try {
        const response = await apiClient.getContentStats()
        if (response.success && response.data) {
          setStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }


    const fetchUsers = async () => {
      try {
        const response = await apiClient.getAllUsers()
        if (response.success && response.data) {
          setUsers(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    const fetchUserStats = async () => {
      try {
        const response = await apiClient.getUserStats()
        if (response.success && response.data) {
          setUserStats(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
      }
    }

    const fetchSettings = async () => {
      try {
        const response = await apiClient.getSystemSettings()
        if (response.success && response.data) {
          setSettings(response.data)
        setSettingsForm(response.data)
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error)
      }
    }

  const fetchRecentActivity = async () => {
    try {
      const response = await apiClient.getRecentActivity()
      if (response.success && response.data) {
        setRecentActivity(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await apiClient.getChartData()
      if (response.success && response.data) {
        setChartData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    }
  }

  const fetchGenres = async () => {
    try {
      const response = await apiClient.getGenres()
      if (response.success && response.data) {
        setAvailableGenres(response.data)
      } else {
        // Fallback genres if response is not successful
        setAvailableGenres([
          'Aksiyon', 'Drama', 'Thriller', 'Komedî', 'Romantîk', 
          'Horror', 'Sci-Fi', 'Fantastîk', 'Crime', 'Mystery',
          'Adventure', 'Animation', 'Documentary', 'Biography', 'History'
        ])
      }
    } catch (error) {
      console.error('Failed to fetch genres:', error)
      // Keep fallback genres on error
    }
  }

  // Fetch admin stats
  useEffect(() => {
    fetchStats()
    fetchUsers()
    fetchUserStats()
    fetchSettings()
    fetchRecentActivity()
    fetchChartData()
    fetchGenres()
    // Fetch movies and series for admin panel
    fetchMovies()
    fetchSeries()
  }, [])

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400">You need admin privileges to access this page.</p>
        </div>
      </div>
    )
  }

  // Altyazı dosyası ekleme
  const handleSubtitleFileAdd = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files)
    const newLanguages: string[] = []
    const newLanguageNames: string[] = []
    
    newFiles.forEach((file, index) => {
      const fileName = file.name.toLowerCase()
      let language = 'tr' // varsayılan
      let languageName = 'Türkçe'
      
      // Dosya adından dil tespiti
      if (fileName.includes('english') || fileName.includes('en')) {
        language = 'en'
        languageName = 'English'
      } else if (fileName.includes('kurdish') || fileName.includes('ku')) {
        language = 'ku'
        languageName = 'Kurdish'
      } else if (fileName.includes('arabic') || fileName.includes('ar')) {
        language = 'ar'
        languageName = 'العربية'
      } else if (fileName.includes('persian') || fileName.includes('fa')) {
        language = 'fa'
        languageName = 'فارسی'
      }
      
      newLanguages.push(language)
      newLanguageNames.push(languageName)
    })
    
    setUploadForm(prev => ({
      ...prev,
      subtitleFiles: [...prev.subtitleFiles, ...newFiles],
      subtitleLanguages: [...prev.subtitleLanguages, ...newLanguages],
      subtitleLanguageNames: [...prev.subtitleLanguageNames, ...newLanguageNames]
    }))
  }

  // Altyazı dosyası kaldırma
  const handleSubtitleFileRemove = (index: number) => {
    setUploadForm(prev => ({
      ...prev,
      subtitleFiles: prev.subtitleFiles.filter((_, i) => i !== index),
      subtitleLanguages: prev.subtitleLanguages.filter((_, i) => i !== index),
      subtitleLanguageNames: prev.subtitleLanguageNames.filter((_, i) => i !== index)
    }))
  }

  // Handle content upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Backend'in beklediği formata dönüştür
      const videoData = {
        title: uploadForm.titleKurdish,
        description: uploadForm.descriptionKurdish,
        genre: uploadForm.genre,
        year: uploadForm.year,
        duration: uploadForm.duration,
        rating: uploadForm.rating,
        isFeatured: uploadForm.isFeatured,
        isNew: uploadForm.isNew,
        type: uploadForm.contentType === 'movie' ? 'movie' : 'series',
        seasonNumber: uploadForm.contentType === 'series' ? uploadForm.seasonNumber : undefined,
        episodeNumber: uploadForm.contentType === 'series' ? uploadForm.episodeNumber : undefined,
        seriesId: uploadForm.contentType === 'series' ? uploadForm.seriesId : undefined,
        trailerUrl: uploadForm.trailerUrl || undefined
      }

      // FormData oluştur
      const formData = new FormData()
      
      // Video data'sını JSON olarak ekle
      formData.append('data', JSON.stringify(videoData))

      // Gerçek dosyaları ekle
      if (uploadForm.videoFile) {
        formData.append('files', uploadForm.videoFile)
      }
      
      if (uploadForm.thumbnailFile) {
        formData.append('files', uploadForm.thumbnailFile)
      }

      // Gerçek upload progress tracking
      console.log('🚀 Starting upload with FormData:', formData)
      console.log('📁 Video file:', uploadForm.videoFile)
      console.log('🖼️ Thumbnail file:', uploadForm.thumbnailFile)
      
      const response = await apiClient.uploadContentWithProgress(formData, (progress) => {
        console.log('📊 Upload progress:', progress + '%')
        setUploadProgress(progress)
      })
      
      console.log('📡 Upload response:', response)
      
      if (response.success) {
        alert('Content uploaded successfully!')
        setUploadForm({
          title: '',
          titleKurdish: '',
          description: '',
          descriptionKurdish: '',
          year: new Date().getFullYear(),
          genre: [],
          director: '',
          cast: [],
          language: [],
          quality: 'HD',
          contentType: 'movie',
          duration: 0,
          rating: 0,
          isFeatured: false,
          isNew: false,
          trailerUrl: '',
          seasonNumber: 0,
          episodeNumber: 0,
          seriesId: '',
          videoFile: null,
          thumbnailFile: null,
          subtitleFiles: [],
          subtitleLanguages: [],
          subtitleLanguageNames: []
        })
        
        // Refresh content
        await Promise.all([fetchMovies(), fetchSeries()])
      } else {
        alert('Upload failed: ' + response.error)
      }
    } catch (error) {
      alert('Upload failed: ' + error)
    } finally {
      setIsLoading(false)
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000) // Reset progress after 1 second
    }
  }

  // Handle content deletion
  const handleDelete = async (id: string, contentType: 'movie' | 'series') => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await apiClient.deleteContent(id)
      if (response.success) {
        alert('Content deleted successfully!')
        // Refresh content
        await Promise.all([fetchMovies(), fetchSeries()])
      } else {
        alert('Deletion failed: ' + response.error)
      }
    } catch (error) {
      alert('Deletion failed: ' + error)
    }
  }

  // Handle content edit
  const handleEdit = (id: string, contentType: 'movie' | 'series') => {
    const content = contentType === 'movie' 
      ? movies.find(m => m.id === id)
      : series.find(s => s.id === id)
    
    if (content) {
      setEditingContent({
        ...content,
        contentType
      })
      setShowEditContentModal(true)
    }
  }

  // Handle content view
  const handleView = (id: string) => {
    window.open(`/videos/${id}`, '_blank')
  }

  // Handle content save
  const handleSaveContent = async () => {
    if (!editingContent) return

    try {
      setIsLoading(true)
      const response = await apiClient.updateContent(editingContent.id, {
        title: editingContent.title,
        titleKurdish: editingContent.titleKurdish,
        description: editingContent.description,
        year: editingContent.year,
        rating: editingContent.rating,
        isFeatured: editingContent.isFeatured,
        isNew: editingContent.isNew
      })

      if (response.success) {
        alert('Content updated successfully!')
        setShowEditContentModal(false)
        // Refresh content
        await Promise.all([fetchMovies(), fetchSeries()])
      } else {
        alert('Update failed: ' + response.error)
      }
    } catch (error) {
      alert('Update failed: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle settings form changes
  const handleSettingsChange = (field: string, value: any) => {
    setSettingsForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle settings save
  const handleSaveSettings = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.updateSystemSettings(settingsForm)
      if (response.success) {
        alert('Settings saved successfully!')
        await fetchSettings() // Refresh settings
      } else {
        alert('Failed to save settings: ' + response.error)
      }
    } catch (error) {
      alert('Failed to save settings: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user actions
  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleChangeRole = (user: User) => {
    setSelectedUser(user)
    setShowRoleModal(true)
  }

  const handleDeleteUser = async (user: User) => {
    // Check if user is admin
    if (user.role === 'admin') {
      alert('Cannot delete admin users!')
      return
    }

    if (!confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) return

    try {
      setIsLoading(true)
      const response = await apiClient.deleteUser(user.id)
      if (response.success) {
        alert('User deleted successfully!')
        await fetchUsers() // Refresh users list
      } else {
        alert('Failed to delete user: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to delete user: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return

    try {
      setIsLoading(true)
      const response = await apiClient.updateUser(editingUser.id, userData)
      if (response.success) {
        alert('User updated successfully!')
        setShowEditModal(false)
        setEditingUser(null)
        await fetchUsers() // Refresh users list
      } else {
        alert('Failed to update user: ' + response.error)
      }
    } catch (error) {
      alert('Failed to update user: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (newRole: string) => {
    if (!selectedUser) return

    try {
      setIsLoading(true)
      const response = await apiClient.changeUserRole(selectedUser.id, newRole)
      if (response.success) {
        alert(`User role changed to ${newRole}!`)
        setShowRoleModal(false)
        setSelectedUser(null)
        await fetchUsers() // Refresh users list
      } else {
        alert('Failed to change user role: ' + (response.error || 'Unknown error'))
      }
    } catch (error) {
      alert('Failed to change user role: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-sm sm:text-base text-slate-400">Manage your platform content and users</p>
        </div>

        {/* Navigation Tabs - Mobile Responsive */}
        <div className="mb-4 sm:mb-8 border-b border-slate-800 overflow-x-auto">
          <div className="flex gap-2 sm:gap-4 min-w-max">
            {[
              { id: 'dashboard', label: 'Dashboard', shortLabel: 'Dash', icon: BarChart3 },
              { id: 'upload', label: 'Upload Content', shortLabel: 'Upload', icon: Upload },
              { id: 'movies', label: 'Movies', shortLabel: 'Movies', icon: Film },
              { id: 'series', label: 'Series', shortLabel: 'Series', icon: Tv },
              { id: 'users', label: 'Users', shortLabel: 'Users', icon: Users },
              { id: 'settings', label: 'Settings', shortLabel: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 border-b-2 transition-colors duration-200 whitespace-nowrap text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats && (
                  <>
                    <div className="bg-slate-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Film className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-slate-400 text-sm">Total Movies</p>
                          <p className="text-2xl font-bold">{stats.totalMovies}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Tv className="w-8 h-8 text-green-500" />
                        <div>
                          <p className="text-slate-400 text-sm">Total Series</p>
                          <p className="text-2xl font-bold">{stats.totalSeries}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-purple-500" />
                        <div>
                          <p className="text-slate-400 text-sm">Total Users</p>
                          <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Eye className="w-8 h-8 text-red-500" />
                        <div>
                          <p className="text-slate-400 text-sm">Total Views</p>
                          <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Recent Activity */}
              <div className="bg-slate-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                        <div className={`w-4 h-4 ${activity.iconColor || 'text-gray-500'}`}>
                          {activity.icon === 'plus' && <Plus className="w-4 h-4" />}
                          {activity.icon === 'users' && <Users className="w-4 h-4" />}
                          {activity.icon === 'trending' && <TrendingUp className="w-4 h-4" />}
                  </div>
                        <span>{activity.message}</span>
                        <span className="text-slate-400 text-sm ml-auto">{activity.time}</span>
                  </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-8">
                      <p>No recent activity</p>
                  </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="max-w-4xl">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Naveroka Nû Barkirin</h3>
              
              <form onSubmit={handleUpload} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cureya Naverokê</label>
                    <select
                      value={uploadForm.contentType}
                      onChange={(e) => setUploadForm({ ...uploadForm, contentType: e.target.value as 'movie' | 'series' })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="movie">Fîlm</option>
                      <option value="series">Dîzî</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Kalîte</label>
                    <select
                      value={uploadForm.quality}
                      onChange={(e) => setUploadForm({ ...uploadForm, quality: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="HD">HD</option>
                      <option value="4K">4K</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sernav (Kurdî)</label>
                  <input
                    type="text"
                    value={uploadForm.titleKurdish}
                    onChange={(e) => setUploadForm({ ...uploadForm, titleKurdish: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Danasîn (Kurdî)</label>
                  <textarea
                    value={uploadForm.descriptionKurdish}
                    onChange={(e) => setUploadForm({ ...uploadForm, descriptionKurdish: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Sal</label>
                    <input
                      type="number"
                      value={uploadForm.year}
                      onChange={(e) => setUploadForm({ ...uploadForm, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Derhêner</label>
                    <input
                      type="text"
                      value={uploadForm.director}
                      onChange={(e) => setUploadForm({ ...uploadForm, director: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cure</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableGenres.length > 0 ? availableGenres.map((genre) => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => {
                          const newGenres = uploadForm.genre.includes(genre)
                            ? uploadForm.genre.filter(g => g !== genre)
                            : [...uploadForm.genre, genre]
                          setUploadForm({ ...uploadForm, genre: newGenres })
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          uploadForm.genre.includes(genre)
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {genre}
                      </button>
                    )) : (
                      <div className="text-slate-400 text-sm">Genre'lar yükleniyor...</div>
                    )}
                  </div>
                  {uploadForm.genre.length > 0 && (
                    <p className="text-sm text-slate-400 mt-2">
                      Hilbijartî: {uploadForm.genre.join(', ')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lîstikvan (bi vîrgulê veqetîne)</label>
                  <input
                    type="text"
                    placeholder="Lîstikvan 1, Lîstikvan 2, Lîstikvan 3"
                    value={uploadForm.cast.join(', ')}
                    onChange={(e) => setUploadForm({ ...uploadForm, cast: e.target.value.split(',').map(c => c.trim()) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Dem (dakîqe)</label>
                  <input
                      type="number"
                      value={uploadForm.duration}
                      onChange={(e) => setUploadForm({ ...uploadForm, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="1"
                    required
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Nirxandin (0-10)</label>
                  <input
                      type="number"
                      value={uploadForm.rating}
                      onChange={(e) => setUploadForm({ ...uploadForm, rating: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0"
                      max="10"
                      step="0.1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trailer URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={uploadForm.trailerUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, trailerUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {uploadForm.contentType === 'series' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Hejmarê Sezonê</label>
                      <input
                        type="number"
                        value={uploadForm.seasonNumber}
                        onChange={(e) => setUploadForm({ ...uploadForm, seasonNumber: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Hejmarê Beşê</label>
                      <input
                        type="number"
                        value={uploadForm.episodeNumber}
                        onChange={(e) => setUploadForm({ ...uploadForm, episodeNumber: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        min="1"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dosyeya Vîdyoyê *</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Check file size (5GB limit)
                          const maxSize = 5 * 1024 * 1024 * 1024 // 5GB
                          if (file.size > maxSize) {
                            alert(`Dosya çok büyük! Maksimum boyut: 5GB. Seçilen dosya: ${(file.size / 1024 / 1024 / 1024).toFixed(2)}GB`)
                            return
                          }
                          setUploadForm({ ...uploadForm, videoFile: file })
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                    required
                  />
                    {uploadForm.videoFile && (
                      <p className="text-sm text-green-400 mt-1">
                        ✓ Hilbijartî: {uploadForm.videoFile.name} ({(uploadForm.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Formên piştgirî: MP4, AVI, MOV, MKV</p>
                </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Wêneyê Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Check file size (10MB limit)
                          const maxSize = 10 * 1024 * 1024 // 10MB
                          if (file.size > maxSize) {
                            alert(`Thumbnail dosyası çok büyük! Maksimum boyut: 10MB. Seçilen dosya: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
                            return
                          }
                          setUploadForm({ ...uploadForm, thumbnailFile: file })
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                    />
                    {uploadForm.thumbnailFile && (
                      <p className="text-sm text-green-400 mt-1">
                        ✓ Hilbijartî: {uploadForm.thumbnailFile.name} ({(uploadForm.thumbnailFile.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">Formên piştgirî: JPG, PNG, GIF</p>
                  </div>
                </div>

                {/* Altyazı Dosyaları */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium mb-2">Dosyeyên Altyazî (Opsiyonel)</label>
                  <input
                    type="file"
                    accept=".srt,.vtt,.ass,.ssa"
                    multiple
                    onChange={(e) => handleSubtitleFileAdd(e.target.files)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 file:mr-2 sm:mr-4 file:py-1 sm:py-2 file:px-2 sm:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
                  />
                  <p className="text-xs text-slate-400 mt-1">Formên piştgirî: SRT, VTT, ASS, SSA</p>
                  
                  {/* Seçilen Altyazı Dosyaları */}
                  {uploadForm.subtitleFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <h4 className="text-sm font-medium text-slate-300">Hilbijartî:</h4>
                      {uploadForm.subtitleFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-slate-800 rounded-lg">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-xs sm:text-sm text-slate-300 truncate">{file.name}</span>
                            <span className="text-xs text-slate-400 whitespace-nowrap">
                              ({uploadForm.subtitleLanguageNames[index]})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSubtitleFileRemove(index)}
                            className="text-red-400 hover:text-red-300 text-xs sm:text-sm ml-2 flex-shrink-0"
                          >
                            Kaldır
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 col-span-1 sm:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadForm.isFeatured}
                      onChange={(e) => setUploadForm({ ...uploadForm, isFeatured: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm">Naveroka Taybet</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={uploadForm.isNew}
                      onChange={(e) => setUploadForm({ ...uploadForm, isNew: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-xs sm:text-sm">Berhemê Nû</span>
                  </label>
                </div>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300 font-medium">Tê barkirin...</span>
                      <span className="text-red-400 font-bold text-lg">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-red-500 to-red-600 h-3 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${uploadProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-sm text-slate-400 text-center">
                      {uploadProgress < 20 && "📁 Dosyalar hazırlanıyor..."}
                      {uploadProgress >= 20 && uploadProgress < 50 && "🚀 Sunucuya gönderiliyor..."}
                      {uploadProgress >= 50 && uploadProgress < 80 && "⚙️ İşleniyor..."}
                      {uploadProgress >= 80 && uploadProgress < 100 && "✨ Neredeyse tamamlandı..."}
                      {uploadProgress === 100 && "✅ Tamamlandı!"}
                    </div>
                    {uploadForm.videoFile && (
                      <div className="text-xs text-slate-500 text-center">
                        📹 {uploadForm.videoFile.name} ({(uploadForm.videoFile.size / 1024 / 1024).toFixed(1)} MB)
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isUploading ? 'Tê barkirin...' : isLoading ? 'Hazırlanıyor...' : 'Naveroka Barkirin'}
                </button>
              </form>
            </div>
          )}

          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Movies Management</h3>
              </div>

              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Movie</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          Loading movies...
                        </td>
                      </tr>
                    ) : movies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No movies found
                        </td>
                      </tr>
                    ) : (
                      movies.map((movie) => (
                      <tr key={movie.id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={movie.thumbnail} alt={movie.title} className="w-12 h-16 object-cover rounded mr-4" />
                            <div>
                              <div className="text-sm font-medium text-white">{movie.title}</div>
                              <div className="text-sm text-slate-400">{movie.titleKurdish}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{movie.year || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            {movie.rating || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{(movie.views || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleView(movie.id)}
                              className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-green-400/10 transition-colors"
                              title="View Movie"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(movie.id, 'movie')}
                              className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                              title="Edit Movie"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(movie.id, 'movie')}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                              title="Delete Movie"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Series Tab */}
          {activeTab === 'series' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Series Management</h3>
              </div>

              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Series</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Seasons</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          Loading series...
                        </td>
                      </tr>
                    ) : series.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                          No series found
                        </td>
                      </tr>
                    ) : (
                      series.map((show) => (
                      <tr key={show.id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img src={show.thumbnail} alt={show.title} className="w-12 h-16 object-cover rounded mr-4" />
                            <div>
                              <div className="text-sm font-medium text-white">{show.title}</div>
                              <div className="text-sm text-slate-400">{show.titleKurdish}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{show.seasons?.length || 0}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            {show.rating || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{(show.views || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleView(show.id)}
                              className="text-green-400 hover:text-green-300 p-1 rounded hover:bg-green-400/10 transition-colors"
                              title="View Series"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(show.id, 'series')}
                              className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-blue-400/10 transition-colors"
                              title="Edit Series"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(show.id, 'series')}
                              className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors"
                              title="Delete Series"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">User Management</h3>
              </div>

              {/* User Stats */}
              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="w-6 h-6 text-blue-500" />
                      <div>
                        <p className="text-slate-400 text-sm">Total Users</p>
                        <p className="text-xl font-bold">{userStats.totalUsers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">A</span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Active Users</p>
                        <p className="text-xl font-bold">{userStats.activeUsers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">I</span>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Inactive Users</p>
                        <p className="text-xl font-bold">{userStats.inactiveUsers}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-purple-500" />
                      <div>
                        <p className="text-slate-400 text-sm">New This Month</p>
                        <p className="text-xl font-bold">{userStats.newUsersThisMonth}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Table */}
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Last Login</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold text-sm">
                                {(user.firstName || user.name)?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">
                                {user.firstName && user.lastName 
                                  ? `${user.firstName} ${user.lastName}` 
                                  : user.name || 'Unknown User'
                                }
                              </div>
                              <div className="text-sm text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : user.role === 'moderator'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditUser(user)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleChangeRole(user)}
                              className="text-yellow-400 hover:text-yellow-300"
                              title="Change Role"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user)}
                              className={`${user.role === 'admin' ? 'text-gray-500 cursor-not-allowed' : 'text-red-400 hover:text-red-300'}`}
                              title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete User'}
                              disabled={user.role === 'admin'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Platform Settings</h3>
                <button 
                  onClick={() => fetchSettings()}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Refresh Settings
                </button>
              </div>

              {/* Settings Form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
              <div className="bg-slate-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
                      <input
                        type="text"
                        value={settingsForm?.siteName || ''}
                        onChange={(e) => handleSettingsChange('siteName', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="Filmxane"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Platform Description</label>
                      <textarea
                        value={settingsForm?.siteDescription || ''}
                        onChange={(e) => handleSettingsChange('siteDescription', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="Platform description..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={settingsForm?.contactEmail || ''}
                        onChange={(e) => handleSettingsChange('contactEmail', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="contact@filmxane.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Settings */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">Content Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Max Upload Size (MB)</label>
                      <input
                        type="number"
                        value={settingsForm?.maxUploadSize || 1000}
                        onChange={(e) => handleSettingsChange('maxUploadSize', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Allowed Video Formats</label>
                      <input
                        type="text"
                        value={Array.isArray(settingsForm?.allowedFileTypes) ? settingsForm.allowedFileTypes.join(',') : settingsForm?.allowedFileTypes || 'mp4,avi,mov,mkv'}
                        onChange={(e) => handleSettingsChange('allowedFileTypes', e.target.value.split(',').map(f => f.trim()))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="mp4,avi,mov,mkv"
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsForm?.autoApproveContent || false}
                        onChange={(e) => handleSettingsChange('autoApproveContent', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                      />
                      <label className="ml-2 text-sm text-slate-300">Auto-approve new content</label>
                    </div>
                  </div>
                </div>

                {/* User Settings */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">User Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsForm?.allowRegistration || true}
                        onChange={(e) => handleSettingsChange('allowRegistration', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                      />
                      <label className="ml-2 text-sm text-slate-300">Allow user registration</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settingsForm?.requireEmailVerification || false}
                        onChange={(e) => handleSettingsChange('requireEmailVerification', e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                      />
                      <label className="ml-2 text-sm text-slate-300">Require email verification</label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Default User Role</label>
                      <select
                        value={settingsForm?.defaultUserRole || 'user'}
                        onChange={(e) => handleSettingsChange('defaultUserRole', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* System Settings */}
              <div className="bg-slate-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4 text-white">System Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Maintenance Mode</label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settingsForm?.maintenanceMode || false}
                          onChange={(e) => handleSettingsChange('maintenanceMode', e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-slate-700 border-slate-600 rounded focus:ring-red-500"
                        />
                        <label className="ml-2 text-sm text-slate-300">Enable maintenance mode</label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settingsForm?.sessionTimeout || 30}
                        onChange={(e) => handleSettingsChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settingsForm?.maxLoginAttempts || 5}
                        onChange={(e) => handleSettingsChange('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit User</h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleUpdateUser({
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email')
              })
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  defaultValue={editingUser.firstName || ''}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={editingUser.lastName || ''}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                  required
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Change User Role</h3>
              <button 
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-slate-300">
                Change role for <span className="font-semibold text-white">
                  {selectedUser.firstName} {selectedUser.lastName}
                </span>
              </p>
            </div>
            
            <div className="space-y-3">
              {['user', 'moderator', 'admin'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  disabled={isLoading || selectedUser.role === role}
                  className={`w-full p-3 rounded-lg text-left transition-colors duration-200 ${
                    selectedUser.role === role
                      ? 'bg-red-600 text-white cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize font-medium">{role}</span>
                    {selectedUser.role === role && (
                      <span className="text-sm">Current</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Modal */}
      {showEditContentModal && editingContent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Edit {editingContent.contentType === 'movie' ? 'Movie' : 'Series'}
                </h3>
                <button
                  onClick={() => setShowEditContentModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingContent.title || ''}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      title: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Kurdish Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Kurdish Title
                  </label>
                  <input
                    type="text"
                    value={editingContent.titleKurdish || ''}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      titleKurdish: e.target.value
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingContent.description || ''}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      description: e.target.value
                    })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingContent.year || ''}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      year: parseInt(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editingContent.rating || ''}
                    onChange={(e) => setEditingContent({
                      ...editingContent,
                      rating: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {/* Featured & New */}
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingContent.isFeatured || false}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        isFeatured: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingContent.isNew || false}
                      onChange={(e) => setEditingContent({
                        ...editingContent,
                        isNew: e.target.checked
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-300">New</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  onClick={() => setShowEditContentModal(false)}
                  className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContent}
                  disabled={isLoading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
