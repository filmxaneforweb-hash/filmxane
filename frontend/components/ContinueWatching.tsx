'use client'

// import { div } from 'framer-div' // SSR sorunu nedeniyle kaldırıldı
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { VideoCard } from './VideoCard'

export function ContinueWatching() {
  const continueWatchingVideos = [
    {
      id: '7',
      title: 'Destpêkeke Ciwan',
      description: 'Fîlmeke ciwan û balkêş',
      thumbnail: null,
      duration: 7200,

      progress: 65, // Progress percentage
    },
    {
      id: '8',
      title: 'Çîrokeke Têkildar',
      description: 'Çîrokeke têkildar û balkêş',
      thumbnail: null,
      duration: 5400,

      progress: 30,
    },
    {
      id: '9',
      title: 'Serkeftin',
      description: 'Fîlmeke serkeftin û balkêş',
      thumbnail: null,
      duration: 6300,

      progress: 80,
    },
    {
      id: '10',
      title: 'Hêstbizin',
      description: 'Fîlmeke hêstbizin û balkêş',
      thumbnail: null,
      duration: 4800,

      progress: 45,
    },
    {
      id: '11',
      title: 'Tirs',
      description: 'Fîlmeke tirs û balkêş',
      thumbnail: null,
      duration: 5400,

      progress: 20,
    },
    {
      id: '12',
      title: 'Komedy',
      description: 'Fîlmeke komedî û balkêş',
      thumbnail: null,
      duration: 4500,

      progress: 90,
    },
  ]

  return (
    <section className="py-8 bg-black">
      <div className="px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Bidomîne Temaşe
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
        
        {/* Horizontal Scrolling Grid with Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {continueWatchingVideos.map((video, index) => (
            <div
              key={video.id}
              className="relative"
            >
              <VideoCard 
                id={video.id}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail || undefined}
                duration={video.duration}
              />
              
              {/* Progress Bar */}
              <div className="absolute bottom-16 left-2 right-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
              
              {/* Progress Text */}
              <div className="absolute bottom-14 left-2 text-xs text-white font-medium">
                {video.progress}% temam bû
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
