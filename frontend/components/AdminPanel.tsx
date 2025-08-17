'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Star
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
    contentType: 'movie' as 'movie' | 'series'
  })

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

  // Fetch admin stats
  useEffect(() => {
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

    fetchStats()
  }, [])

  // Handle content upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      Object.entries(uploadForm).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formData.append(key, v))
        } else {
          formData.append(key, value.toString())
        }
      })

      const response = await apiClient.uploadContent(formData)
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
          contentType: 'movie'
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-slate-400">Manage your platform content and users</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'upload', label: 'Upload Content', icon: Upload },
            { id: 'movies', label: 'Movies', icon: Film },
            { id: 'series', label: 'Series', icon: Tv },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-500'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
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
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <Plus className="w-4 h-4 text-green-500" />
                    <span>New movie "The Last Stand" uploaded</span>
                    <span className="text-slate-400 text-sm ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>New user registered: john@example.com</span>
                    <span className="text-slate-400 text-sm ml-auto">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-700 rounded">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                    <span>Series "Breaking Bad" reached 10k views</span>
                    <span className="text-slate-400 text-sm ml-auto">1 day ago</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <h3 className="text-xl font-semibold mb-6">Upload New Content</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Type</label>
                    <select
                      value={uploadForm.contentType}
                      onChange={(e) => setUploadForm({ ...uploadForm, contentType: e.target.value as 'movie' | 'series' })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="movie">Movie</option>
                      <option value="series">Series</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Quality</label>
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
                  <label className="block text-sm font-medium mb-2">Title (English)</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title (Kurdish)</label>
                  <input
                    type="text"
                    value={uploadForm.titleKurdish}
                    onChange={(e) => setUploadForm({ ...uploadForm, titleKurdish: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description (Kurdish)</label>
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
                    <label className="block text-sm font-medium mb-2">Year</label>
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
                    <label className="block text-sm font-medium mb-2">Director</label>
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
                  <label className="block text-sm font-medium mb-2">Genres (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Action, Drama, Thriller"
                    value={uploadForm.genre.join(', ')}
                    onChange={(e) => setUploadForm({ ...uploadForm, genre: e.target.value.split(',').map(g => g.trim()) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cast (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Actor 1, Actor 2, Actor 3"
                    value={uploadForm.cast.join(', ')}
                    onChange={(e) => setUploadForm({ ...uploadForm, cast: e.target.value.split(',').map(c => c.trim()) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Languages (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="English, Kurdish, Arabic"
                    value={uploadForm.language.join(', ')}
                    onChange={(e) => setUploadForm({ ...uploadForm, language: e.target.value.split(',').map(l => l.trim()) })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                >
                  {isLoading ? 'Uploading...' : 'Upload Content'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Movies Tab */}
          {activeTab === 'movies' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Movies Management</h3>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Movie
                </button>
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
                    {movies.map((movie) => (
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
                        <td className="px-6 py-4 text-sm text-slate-300">{movie.year}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            {movie.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{movie.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(movie.id, 'movie')}
                              className="text-red-400 hover:text-red-300"
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
            </motion.div>
          )}

          {/* Series Tab */}
          {activeTab === 'series' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Series Management</h3>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add Series
                </button>
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
                    {series.map((show) => (
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
                        <td className="px-6 py-4 text-sm text-slate-300">{show.seasons.length}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                            {show.rating}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">{show.views.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex gap-2">
                            <button className="text-blue-400 hover:text-blue-300">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(show.id, 'series')}
                              className="text-red-400 hover:text-red-300"
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
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-semibold mb-6">User Management</h3>
              <div className="bg-slate-800 rounded-lg p-6">
                <p className="text-slate-400">User management features coming soon...</p>
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-xl font-semibold mb-6">Platform Settings</h3>
              <div className="bg-slate-800 rounded-lg p-6">
                <p className="text-slate-400">Platform settings features coming soon...</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
