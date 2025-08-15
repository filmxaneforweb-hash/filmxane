'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VideoCard } from './VideoCard'
import { getSafeImageUrl, getResponsiveGridClass } from '@/lib/utils'

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
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: API'den featured videos'ları çek
    // Şimdilik mock data kullanıyoruz
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'Destpêkeke Ciwan',
        description: 'Fîlmeke ciwan û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 7200, // 2 saat
        category: 'Drama',
        viewCount: 1250,
        rating: 4.5,
        uploadedBy: {
          firstName: 'Ehmed',
          lastName: 'Mihemed'
        }
      },
      {
        id: '2',
        title: 'Çîrokeke Têkildar',
        description: 'Çîrokeke têkildar û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 5400, // 1.5 saat
        category: 'Komedy',
        viewCount: 890,
        rating: 4.2,
        uploadedBy: {
          firstName: 'Fatime',
          lastName: 'Elî'
        }
      },
      {
        id: '3',
        title: 'Serkeftin',
        description: 'Fîlmeke serkeftin û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 6300, // 1.75 saat
        category: 'Aksiyon',
        viewCount: 2100,
        rating: 4.7,
        uploadedBy: {
          firstName: 'Kurdî',
          lastName: 'Film'
        }
      },
      {
        id: '4',
        title: 'Hêstbizin',
        description: 'Fîlmeke hêstbizin û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 4800, // 1.33 saat
        category: 'Romantîk',
        viewCount: 1560,
        rating: 4.3,
        uploadedBy: {
          firstName: 'Zîn',
          lastName: 'Kurd'
        }
      },
      {
        id: '5',
        title: 'Tirs',
        description: 'Fîlmeke tirs û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 5400, // 1.5 saat
        category: 'Horror',
        viewCount: 980,
        rating: 4.6,
        uploadedBy: {
          firstName: 'Tirs',
          lastName: 'Film'
        }
      },
      {
        id: '6',
        title: 'Komedy',
        description: 'Fîlmeke komedî û balkêş',
        thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
        duration: 4500, // 1.25 saat
        category: 'Komedy',
        viewCount: 3200,
        rating: 4.1,
        uploadedBy: {
          firstName: 'Komedy',
          lastName: 'Kurd'
        }
      }
    ]
    
    setVideos(mockVideos)
    setLoading(false)
  }, [])

  if (loading) {
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
                thumbnailUrl={video.thumbnail}
                duration={video.duration}
                rating={video.rating}
                viewCount={video.viewCount}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
