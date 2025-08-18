'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Heart, Clock, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getSafeImageUrl } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnail?: string
  thumbnailUrl?: string
  posterUrl?: string
  thumbnailPath?: string
  duration?: number
  rating?: number
  views?: number
  isFavorite?: boolean
  onFavoriteToggle?: () => void
}

export function VideoCard({
  id,
  title,
  description,
  thumbnail,
  thumbnailUrl,
  thumbnailPath,
  duration,
  rating,
  views,
  isFavorite = false,
  onFavoriteToggle,
}: VideoCardProps) {
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite)

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

  const handleFavoriteToggle = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle()
    } else {
      // Local state management if no external handler
      setLocalIsFavorite(!localIsFavorite)
      console.log(`${localIsFavorite ? 'Removing' : 'Adding'} ${title} to favorites`)
      alert(`${localIsFavorite ? 'Ji favorî hate rakirin' : 'Li favorî hate zêdekirin'}: ${title}`)
    }
  }

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options for:', title)
    alert(`Vebijêrkên zêdetir ji bo: ${title}`)
  }

  const currentFavoriteState = onFavoriteToggle ? isFavorite : localIsFavorite

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
          src={getSafeImageUrl(thumbnailUrl || posterUrl || thumbnail || thumbnailPath, 300, 200, 'thumbnail')}
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
        <button
          onClick={handleFavoriteToggle}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110"
        >
          <Heart
            className={`w-4 h-4 ${currentFavoriteState ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>

        {/* More options button */}
        <button
          onClick={handleMoreOptions}
          className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Meta info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {rating && (
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span>{rating}</span>
              </div>
            )}
            {views && (
              <div className="flex items-center gap-1">
                <span>👁</span>
                <span>{formatViewCount(views)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
