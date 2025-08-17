'use client'

import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { VideoCard } from './VideoCard'
import { getSafeImageUrl, getResponsiveGridClass } from '@/lib/utils'

export function TrendingNow() {
  const trendingVideos = [
    {
      id: '1',
      title: 'Serkeftin',
      description: 'Fîlmeke serkeftin û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 7200,
      rating: 4.5,
      viewCount: 2500,
    },
    {
      id: '2',
      title: 'Hêstbizin',
      description: 'Fîlmeke hêstbizin û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 5400,
      rating: 4.2,
      viewCount: 1800,
    },
    {
      id: '3',
      title: 'Tirs',
      description: 'Fîlmeke tirs û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 6300,
      rating: 4.7,
      viewCount: 3200,
    },
    {
      id: '4',
      title: 'Komedy',
      description: 'Fîlmeke komedî û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 4800,
      rating: 4.0,
      viewCount: 2100,
    },
    {
      id: '5',
      title: 'Aksiyon',
      description: 'Fîlmeke aksiyon û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 6600,
      rating: 4.8,
      viewCount: 4100,
    },
    {
      id: '6',
      title: 'Drama',
      description: 'Fîlmeke dramatîk û balkêş',
      thumbnail: getSafeImageUrl(null, 300, 200, 'thumbnail'),
      duration: 5700,
      rating: 4.3,
      viewCount: 1900,
    },
  ]

  return (
    <section className="py-8 bg-black">
      <div className="px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Niha Têne Dîtin
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
        
        {/* Horizontal Scrolling Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {trendingVideos.map((video, index) => (
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
                views={video.views}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
