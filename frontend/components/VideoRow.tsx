'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, Star, Clock, Users } from 'lucide-react'
import { VideoCard } from './VideoCard'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  thumbnailUrl?: string
  posterUrl?: string
  duration?: number
  rating?: number
  views?: number
  progress?: number
}

interface VideoRowProps {
  title: string
  videos: Video[]
  category: string
  showProgress?: boolean
  className?: string
}

export function VideoRow({ 
  title, 
  videos, 
  category, 
  showProgress = false,
  className = ''
}: VideoRowProps) {
  const getCategoryIcon = (cat: string) => {
    const icons = {
      'trending': TrendingUp,
      'featured': Star,
      'continue': Clock,
      'recent': Clock,
      'popular': Users,
      'default': Star
    }
    return icons[cat.toLowerCase() as keyof typeof icons] || icons.default
  }

  const getCategoryColor = (cat: string) => {
    const colors = {
      'trending': 'from-orange-500 to-red-500',
      'featured': 'from-red-500 to-pink-500',
      'continue': 'from-green-500 to-emerald-500',
      'recent': 'from-blue-500 to-cyan-500',
      'popular': 'from-purple-500 to-indigo-500',
      'default': 'from-slate-500 to-gray-500'
    }
    return colors[cat.toLowerCase() as keyof typeof colors] || colors.default
  }

  const CategoryIcon = getCategoryIcon(category)

  return (
    <section className={`py-12 bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 ${className}`}>
      <div className="px-8 max-w-7xl mx-auto">
        {/* Modern section header with gradient */}
        <motion.div 
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            {/* Modern category badge */}
            <motion.div 
              className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(category)} rounded-2xl flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <CategoryIcon className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Enhanced title with subtitle */}
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight mb-1">
                {title}
              </h2>
              <p className="text-slate-400 text-sm font-medium capitalize">
                {category} • {videos.length} video
              </p>
            </div>
          </div>
          
          {/* Modern navigation arrows with glassmorphism */}
          <div className="flex items-center gap-3">
            <motion.button 
              className="p-3 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 shadow-lg"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="p-3 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 shadow-lg"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
        
        {/* Modern video grid with enhanced spacing */}
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="relative flex-shrink-0 w-72 group"
            >
              <VideoCard 
                id={video.id}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
                thumbnailUrl={video.thumbnailUrl}
                posterUrl={video.posterUrl}
                duration={video.duration}
                rating={video.rating}
                views={video.views}
              />
              
              {/* Enhanced Progress Bar with modern design */}
              {showProgress && video.progress && (
                <>
                  {/* Progress background with glassmorphism */}
                  <div className="absolute bottom-20 left-3 right-3 h-2 bg-slate-800/60 backdrop-blur-sm rounded-full overflow-hidden border border-slate-600/30">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"
                      initial={{ width: 0 }}
                      animate={{ width: `${video.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                  
                  {/* Progress Text with modern styling */}
                  <div className="absolute bottom-16 left-3 text-xs text-white font-semibold bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-600/30">
                    {video.progress}% temam bû
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Modern "View All" button */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="px-8 py-3 bg-slate-800/40 backdrop-blur-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/40 font-medium"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Hemû {category} bibîne →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
