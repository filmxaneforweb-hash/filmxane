'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Play, Heart, Clock, Star } from 'lucide-react'
import { Movie, Series } from '@/lib/api'
import { getSafeImageUrl, getRandomPlaceholderImage } from '@/lib/utils'

interface ContentGridProps {
  title: string
  subtitle?: string
  items: (Movie | Series)[]
  showViewAll?: boolean
  viewAllLink?: string
  maxItems?: number
}

export function ContentGrid({ 
  title, 
  subtitle, 
  items, 
  showViewAll = false, 
  viewAllLink = '#',
  maxItems = 20 
}: ContentGridProps) {
  const [startIndex, setStartIndex] = useState(0)
  const itemsToShow = items.slice(0, maxItems)
  const canScrollLeft = startIndex > 0
  const canScrollRight = startIndex + 6 < itemsToShow.length

  const scrollLeft = () => {
    setStartIndex(Math.max(0, startIndex - 6))
  }

  const scrollRight = () => {
    setStartIndex(Math.min(itemsToShow.length - 6, startIndex + 6))
  }

  if (itemsToShow.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
            {subtitle && (
              <p className="text-slate-400 text-lg">{subtitle}</p>
            )}
          </div>
          
          {showViewAll && (
            <button
              onClick={() => window.location.href = viewAllLink}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Hemû Bibîne →
            </button>
          )}
        </div>

        {/* Content Row */}
        <div className="relative group">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
              onClick={scrollLeft}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {canScrollRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 shadow-lg hover:scale-110 active:scale-95"
              onClick={scrollRight}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Content Grid */}
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {itemsToShow.slice(startIndex, startIndex + 6).map((item, index) => {
              const isMovie = 'videoUrl' in item
              const itemIndex = startIndex + index
              
              return (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-64 group/item"
                >
                  <div className="relative overflow-hidden rounded-lg bg-slate-800 hover:bg-slate-700 transition-all duration-300 group-hover/item:scale-105 cursor-pointer"
                       onClick={() => window.location.href = `/videos/${item.id}`}>
                      {/* Thumbnail */}
                      <div className="relative aspect-[2/3] overflow-hidden">
                        <img
                          src={getSafeImageUrl(item.thumbnailUrl || item.posterUrl || item.thumbnail, 300, 400, 'poster')}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-110"
                          onError={(e) => {
                            // Resim yüklenemezse placeholder göster
                            const target = e.target as HTMLImageElement;
                            target.src = getRandomPlaceholderImage(300, 400);
                          }}
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                        
                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                          <div className="w-16 h-16 bg-white/90 text-black rounded-full flex items-center justify-center shadow-lg">
                            <Play className="w-8 h-8 ml-1" />
                          </div>
                        </div>

                        {/* Quality Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded font-medium">
                          {item.quality}
                        </div>

                        {/* New Badge */}
                        {item.isNew && (
                          <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded font-medium">
                            NÛ
                          </div>
                        )}
                      </div>

                      {/* Content Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2 group-hover/item:text-red-400 transition-colors duration-200">
                          {item.title}
                        </h3>
                        
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {item.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {isMovie ? `${item.duration || 0} deqîqe` : `${(item as any).totalSeasons || 0} sezon`}
                            </span>
                          </div>
                        </div>

                        {/* Genres */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {(typeof item.genre === 'string' ? JSON.parse(item.genre) : item.genre).slice(0, 2).map((genre: string) => (
                            <span
                              key={genre}
                              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300">
                        <button className="p-2 bg-slate-800/80 text-white rounded-full hover:bg-red-500 transition-colors duration-200 backdrop-blur-sm">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll Indicator */}
        {itemsToShow.length > 6 && (
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(itemsToShow.length / 6) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index * 6)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === Math.floor(startIndex / 6)
                      ? 'bg-red-500 scale-125'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
