'use client'

import { useState, useEffect } from 'react'
// import { motion } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
import { Play, Heart, Clock, MoreVertical, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl } from '@/lib/utils'
import { apiClient } from '@/lib/api'

interface VideoCardProps {
  id: string
  title: string
  description?: string
  thumbnail?: string
  thumbnailUrl?: string
  posterUrl?: string
  thumbnailPath?: string
  duration?: number
  rating?: number
  isFavorite?: boolean
  onFavoriteToggle?: () => void
  onWatch?: () => void
}

export function VideoCard({
  id,
  title = 'Untitled Video',
  description = '',
  thumbnail,
  thumbnailUrl,
  posterUrl,
  thumbnailPath,
  duration,
  rating,
  isFavorite = false,
  onFavoriteToggle,
  onWatch,
}: VideoCardProps) {
  // Ensure title is always a string
  const safeTitle = typeof title === 'string' ? title : 'Untitled Video'
  const safeDescription = typeof description === 'string' ? description : ''
  
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite)
  const [isLoading, setIsLoading] = useState(false)
  const [watchProgress, setWatchProgress] = useState<any>(null)
  const [showProgressBar, setShowProgressBar] = useState(false)

  // Backend'den favori durumunu kontrol et
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const token = localStorage.getItem('filmxane_token')
        if (!token) return

        const response = await fetch(`https://filmxane-backend.onrender.com/api/favorites/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ videoId: id })
        })

        const data = await response.json()
        if (data.success && data.data) {
          setLocalIsFavorite(data.data.isFavorite || false)
        }
      } catch (error) {
        console.error('Favori durumu kontrol edilemedi:', error)
      }
    }

    checkFavoriteStatus()
  }, [id])

  // Watch progress'i fetch et
  useEffect(() => {
    const fetchWatchProgress = async () => {
      try {
        const token = localStorage.getItem('filmxane_token')
        if (!token) return

        const response = await fetch(`https://filmxane-backend.onrender.com/api/videos/watch-progress/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const data = await response.json()
        if (data.success && data.data && data.data.watchDuration > 0) {
          setWatchProgress(data.data)
          setShowProgressBar(true)
        }
      } catch (error) {
        console.error('Watch progress fetch error:', error)
      }
    }

    fetchWatchProgress()
  }, [id])

  const formatDuration = (minutes: number) => {
    // Dakika olarak gelen değeri formatla
    const safeMinutes = Math.max(0, Math.round(minutes))
    
    const hours = Math.floor(safeMinutes / 60)
    const mins = safeMinutes % 60
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}`
    } else {
      return `${mins}m`
    }
  }



  const handleFavoriteToggle = async () => {
    if (onFavoriteToggle) {
      onFavoriteToggle()
      return
    }

    // Backend'e favori ekleme/çıkarma
    try {
      setIsLoading(true)
      const token = localStorage.getItem('filmxane_token')
      console.log('🔍 Favori toggle - Token:', token ? 'Var' : 'Yok')
      console.log('🔍 Video ID:', id)
      console.log('🔍 Mevcut favori durumu:', localIsFavorite)
      
      if (!token) {
        alert('Favori eklemek için giriş yapmalısınız')
        return
      }

      if (localIsFavorite) {
        // Favorilerden çıkar
        console.log('🔍 Favori çıkarma isteği gönderiliyor...')
        const response = await fetch(`https://filmxane-backend.onrender.com/api/favorites`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ videoId: id })
        })

        console.log('🔍 Response status:', response.status)
        const data = await response.json()
        console.log('🔍 Response data:', data)
        
        if (data.success) {
          setLocalIsFavorite(false)
          console.log(`${safeTitle} favorilerden çıkarıldı`)
          
          // Custom event tetikle - profil sayfasındaki istatistikler güncellensin
          window.dispatchEvent(new CustomEvent('favoriteChanged', { 
            detail: { action: 'removed', videoId: id } 
          }))
          
          console.log('✅ Favori durumu güncellendi, profil sayfası otomatik yenilenecek')
        } else {
          console.error('❌ Favori çıkarma başarısız:', data.error || data.message)
        }
      } else {
        // Favorilere ekle
        console.log('🔍 Favori ekleme isteği gönderiliyor...')
        const response = await fetch(`https://filmxane-backend.onrender.com/api/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ videoId: id, type: 'movie' })
        })

        console.log('🔍 Response status:', response.status)
        const data = await response.json()
        console.log('🔍 Response data:', data)
        
        if (data.success) {
          setLocalIsFavorite(true)
          console.log(`${safeTitle} favorilere eklendi`)
          
          // Custom event tetikle - profil sayfasındaki istatistikler güncellensin
          window.dispatchEvent(new CustomEvent('favoriteChanged', { 
            detail: { action: 'added', videoId: id } 
          }))
          
          console.log('✅ Favori durumu güncellendi, profil sayfası otomatik yenilenecek')
        } else {
          console.error('❌ Favori ekleme başarısız:', data.error || data.message)
        }
      }
    } catch (error) {
      console.error('Favori işlemi başarısız:', error)
      alert('Favori işlemi başarısız oldu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoreOptions = () => {
    // TODO: Implement more options menu
    console.log('More options for:', safeTitle)
    alert(`Vebijêrkên zêdetir ji bo: ${safeTitle}`)
  }

  const currentFavoriteState = onFavoriteToggle ? isFavorite : localIsFavorite

  return (
    <div 
      className="group relative bg-slate-800/50 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-slate-700/30 hover:border-slate-600/50 backdrop-blur-sm hover:scale-102 hover:-translate-y-1"
      onClick={() => window.location.href = `/videos/${id}`}
    >
      {/* Thumbnail - Netflix style */}
      <div 
        className="relative aspect-video overflow-hidden cursor-pointer"
        onClick={() => window.location.href = `/videos/${id}`}
      >
        <Image
          src={getSafeImageUrl(thumbnailUrl || posterUrl || thumbnail || thumbnailPath, 300, 200, 'thumbnail')}
          alt={safeTitle}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
          unoptimized
          onError={(e) => {
            // Image yüklenemezse fallback göster
            console.warn('Image failed to load for:', safeTitle)
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
         
         {/* Netflix style play button */}
         <div 
           className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
           onClick={(e) => {
             e.preventDefault()
             // Don't stop propagation - let it bubble up to parent
             if (onWatch) {
               onWatch()
             } else {
               // If no onWatch callback, navigate to video page
               window.location.href = `/videos/${id}`
             }
           }}
         >
           <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
             <Play className="w-6 h-6 text-black fill-black" />
           </div>
         </div>

        {/* Duration */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1 backdrop-blur-sm">
            <Clock className="w-3 h-3" />
            {formatDuration(duration)}
          </div>
        )}

        {/* Watch Progress Bar */}
        {showProgressBar && watchProgress && (
          <div className="absolute bottom-2 left-2 right-16">
            <div className="w-full bg-black/50 rounded-full h-1.5 backdrop-blur-sm">
              <div 
                className="bg-red-500 h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${duration && watchProgress.watchDuration ? Math.min(100, Math.max(0, ((watchProgress.watchDuration * 60) / duration) * 100)) : 0}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleFavoriteToggle()
          }}
          disabled={isLoading}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Heart
              className={`w-4 h-4 ${currentFavoriteState ? 'fill-red-500 text-red-500' : ''}`}
            />
          )}
        </button>

        {/* More options button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleMoreOptions()
          }}
          className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm hover:scale-110 opacity-0 group-hover:opacity-100"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors duration-200">
          {safeTitle}
        </h3>
        
        <p className="text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {safeDescription}
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

          </div>
        </div>
      </div>
    </div>
  )
}
