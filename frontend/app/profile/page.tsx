'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Heart, Clock, Star, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiClient } from '@/lib/api'

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  const [userStats, setUserStats] = useState({
    totalWatched: 0,
    totalHours: 0,
    averageRating: 0,
    favorites: 0
  })
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) {
        setError('Please login to view your profile')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch user stats and activity
        const [statsResponse, activityResponse] = await Promise.all([
          apiClient.getContentStats(),
          apiClient.getWatchHistory()
        ])

        if (statsResponse.success && statsResponse.data) {
          setUserStats({
            totalWatched: statsResponse.data.totalViews || 0,
            totalHours: Math.floor((statsResponse.data.totalViews || 0) * 2 / 60), // Assuming 2 hours average
            averageRating: 4.2, // Default value
            favorites: 0 // Will be fetched separately
          })
        }

        if (activityResponse.success && activityResponse.data) {
          setRecentActivity(activityResponse.data.slice(0, 5)) // Show last 5 activities
        }

      } catch (error) {
        console.error('Error fetching user data:', error)
        setError('Failed to fetch user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [isAuthenticated])

  const handleSettingsClick = () => {
    // Navigate to settings page
    window.location.href = '/settings'
  }

  const handleActivityClick = (activityId: number, activityTitle: string, activityType: string) => {
    // TODO: Implement activity click functionality
    console.log(`Activity clicked: ${activityTitle} (ID: ${activityId}, Type: ${activityType})`)
    
    switch (activityType) {
      case 'watch':
        alert(`Temaşeya ${activityTitle} dê dest pê bike`)
        break
      case 'favorite':
        alert(`${activityTitle} dê ji lîsta te ya xweşbînî were rakirin`)
        break
      case 'recommend':
        alert(`Pêşniyara ${activityTitle} dê were nîşandan`)
        break
      default:
        alert(`Çalakiyeke nû: ${activityTitle}`)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 text-white text-center py-16">Loading...</div>
  }

  if (error) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 text-white text-center py-16">{error}</div>
  }

  if (!isAuthenticated) {
    return <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 text-white text-center py-16">Please <a href="/login" className="underline">login</a> to view your profile.</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">{user?.name?.[0]}</span>
                </div>
                <motion.button
                  onClick={handleSettingsClick}
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="w-5 h-5" />
                </motion.button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-white mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {user?.name}
                </motion.h1>
                <motion.div 
                  className="space-y-2 text-slate-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Endam ji {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Statîstîkên Te
          </motion.h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: 'Fîlmên Temaşe Kirî', value: userStats.totalWatched, color: 'from-blue-500 to-blue-600' },
              { icon: Clock, label: 'Saetên Temaşe', value: `${userStats.totalHours}h`, color: 'from-green-500 to-green-600' },
              { icon: Star, label: 'Pûana Navîn', value: userStats.averageRating, color: 'from-yellow-500 to-yellow-600' },
              { icon: Heart, label: 'Favorî', value: userStats.favorites, color: 'from-red-500 to-red-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-xl border border-slate-600/30 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl font-bold text-white mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Çalakiyên Dawî
          </motion.h2>
          
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.button
                  key={activity.id}
                  onClick={() => handleActivityClick(activity.id, activity.title, activity.type)}
                  className="w-full flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 text-left"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.6 + index * 0.1 }}
                >
                  <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
                    {activity.type === 'watch' && <Clock className="w-5 h-5 text-blue-400" />}
                    {activity.type === 'favorite' && <Heart className="w-5 h-5 text-red-400" />}
                    {activity.type === 'recommend' && <Star className="w-5 h-5 text-yellow-400" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    <p className="text-slate-400 text-sm">{activity.action}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.time}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
