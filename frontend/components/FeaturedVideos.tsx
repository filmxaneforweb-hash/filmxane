'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VideoCard } from './VideoCard'
import { getSafeImageUrl, getResponsiveGridClass } from '@/lib/utils'
import { useContent } from '@/contexts/ContentContext'

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  category: string
  viewCount?: number
  rating?: number
  uploadedBy: {
    firstName: string
    lastName: string
  }
}

export function FeaturedVideos() {
  const { movies, series, isLoading } = useContent()
  const [currentIndex, setCurrentIndex] = useState(0)

  // Combine movies and series, filter featured content
  const featuredContent = [...(movies || []), ...(series || [])]
    .filter(content => content.isFeatured)
    .slice(0, 10)

  // Convert to Video interface format
  const videos: Video[] = featuredContent.map(content => ({
    id: content.id,
    title: content.title,
    description: content.description || '',
    thumbnail: getSafeImageUrl(content.thumbnail, 300, 200, 'thumbnail'),
    duration: 'duration' in content ? content.duration : 0,
    category: content.genre?.[0] || 'Unknown',
    viewCount: content.views || 0,
    rating: 'rating' in content ? content.rating : 0,
    uploadedBy: {
      firstName: content.director || 'Unknown',
      lastName: 'Director'
    }
  }))

  if (isLoading) {
    return (
      <section className="py-8 bg-black">
        <div className="px-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-8 h-8 bg-red-600 rounded"></div>
            <div className="h-8 bg-gray-800 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 aspect-video rounded-md mb-3"></div>
                <div className="bg-gray-800 h-4 rounded mb-2"></div>
                <div className="bg-gray-800 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 bg-black">
      <div className="px-8">
        {/* Netflix style section header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Fîlmên Têne Hilbijartin
            </h2>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors duration-200 backdrop-blur-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-full transition-colors duration-200 backdrop-blur-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Netflix style video grid */}
        <div className={`${getResponsiveGridClass()} gap-3`}>
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <VideoCard 
                id={video.id}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
                duration={video.duration}
                rating={video.rating}
                views={video.viewCount}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
