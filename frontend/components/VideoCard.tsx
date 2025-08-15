'use client'

import { motion } from 'framer-motion'
import { Play, Heart, Clock, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getSafeImageUrl } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnailUrl: string | null
  duration?: number
  rating?: number
  viewCount?: number
  isFavorite?: boolean
  onFavoriteToggle?: () => void
}

export function VideoCard({
  id,
  title,
  description,
  thumbnailUrl,
  duration,
  rating,
  viewCount,
  isFavorite = false,
  onFavoriteToggle,
}: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatViewCount = (count?: number) => {
    if (typeof count !== "number" || isNaN(count)) {
      return "0"
    }
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative bg-slate-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-700/30 hover:border-slate-600/50 backdrop-blur-sm"
    >
      {/* Thumbnail - Netflix style */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={getSafeImageUrl(thumbnailUrl, 300, 200, 'thumbnail')}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          unoptimized
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Netflix style play button */}
        <Link href={`/videos/${id}`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
              <Play className="w-6 h-6 text-black fill-black" />
            </div>
          </div>
        </Link>

        {/* Duration */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {formatDuration(duration)}
          </div>
        )}

        {/* Favorite button */}
        {onFavoriteToggle && (
          <button
            onClick={onFavoriteToggle}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        )}

        {/* More options button */}
        <button className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 opacity-0 group-hover:opacity-100">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Content - Modern minimal style */}
      <div className="p-4">
        <Link href={`/videos/${id}`}>
          <h3 className="font-medium text-sm mb-2 line-clamp-1 group-hover:text-white transition-colors duration-300 text-slate-200">
            {title}
          </h3>
        </Link>
        
        <p className="text-slate-400 text-xs mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Modern minimal meta info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {rating && (
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400">★</span>
                <span className="font-medium text-slate-300">{rating.toFixed(1)}</span>
              </div>
            )}
            <span className="font-medium text-slate-400">{formatViewCount(viewCount)} temaşevan</span>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-500 rounded-md transition-all duration-300 opacity-0 group-hover:opacity-100" />
      
      {/* Netflix style shadow on hover */}
      <div className="absolute inset-0 rounded-md shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  )
}
