'use client'

import { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
import { Play, Info, Heart, Clock, Star } from 'lucide-react'
import Link from 'next/link'
import { useContent } from '@/contexts/ContentContext'
import { Movie, Series } from '@/lib/api'
import { getSafeImageUrl } from '@/lib/utils'

export function HeroSection() {
  const { featuredContent, isLoading } = useContent()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-rotate featured content
  useEffect(() => {
    if (!isAutoPlaying || featuredContent.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredContent.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, featuredContent.length])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  if (isLoading || featuredContent.length === 0) {
    return (
      <div className="relative h-[80vh] bg-gradient-to-b from-slate-900 to-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  const currentContent = featuredContent[currentIndex]
  const isMovie = 'videoUrl' in currentContent

  return (
    <section className="relative h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getSafeImageUrl(currentContent.thumbnail || currentContent.poster, 1920, 1080, 'thumbnail')})`,
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div
            key={currentContent.id}
            className="max-w-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {currentContent.title}
            </h1>

            {/* Kurdish Title */}
            <p className="text-xl md:text-2xl text-red-400 mb-4 font-medium">
              {currentContent.titleKurdish}
            </p>

            {/* Meta Information */}
            <div className="flex items-center gap-4 mb-6 text-sm text-slate-300">
              <span>{currentContent.year}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {isMovie ? `${currentContent.duration} min` : `${currentContent.seasons.length} seasons`}
              </span>
              <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded text-red-400 text-xs">
                {currentContent.quality}
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-300 mb-8 text-lg leading-relaxed">
              {currentContent.description}
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Link
                href={isMovie ? `/movies/${currentContent.id}` : `/series/${currentContent.id}`}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                <Play className="w-5 h-5" />
                Temaşe Bik
              </Link>
              
              <button className="flex items-center gap-2 bg-slate-700/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-600/80 transition-colors duration-200 backdrop-blur-sm">
                <Info className="w-5 h-5" />
                Agahdariyên Zêdetir
              </button>

              <button className="p-3 bg-slate-700/80 text-white rounded-lg hover:bg-slate-600/80 transition-colors duration-200 backdrop-blur-sm">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          {featuredContent.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className="h-full bg-red-500 animate-pulse"
          style={{ width: '100%' }}
        />
      </div>
    </section>
  )
}
