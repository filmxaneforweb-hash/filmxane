'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Heart, Share2, Download, Clock, Star, Eye } from 'lucide-react'
import ReactPlayer from 'react-player'
import { apiClient } from '@/lib/api'
import { Movie, Series } from '@/lib/api'
import { VideoCard } from '@/components/VideoCard'
import { getSafeImageUrl } from '@/lib/utils'

export default function VideoPlayerPage() {
  const params = useParams()
  const videoId = params.id as string
  
  const [video, setVideo] = useState<Movie | Series | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [relatedVideos, setRelatedVideos] = useState<(Movie | Series)[]>([])
  const [showControls, setShowControls] = useState(true)
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        // Doğrudan tüm videoları getir
        const response = await fetch('http://localhost:3005/api/videos')
        if (response.ok) {
          const videos = await response.json()
          const foundVideo = videos.find(v => v.id === videoId)
          if (foundVideo) {
            setVideo(foundVideo)
            // İlgili videoları da getir
            const related = videos
              .filter(v => {
                if (v.id === videoId) return false
                if (!v.genre || !foundVideo.genre) return false
                
                // Genre'ları parse et (JSON string olarak saklanıyor)
                const vGenres = typeof v.genre === 'string' ? JSON.parse(v.genre) : v.genre
                const foundGenres = typeof foundVideo.genre === 'string' ? JSON.parse(foundVideo.genre) : foundVideo.genre
                
                return vGenres.some(g => foundGenres.includes(g))
              })
              .slice(0, 6)
            setRelatedVideos(related)
          } else {
            setError('Video bulunamadı')
          }
        } else {
          setError('Video yüklenemedi')
        }
      } catch (error) {
        console.error('Error fetching video:', error)
        setError('Video yüklenirken hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchVideo()
    }
  }, [videoId])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  // View count'ı backend'e gönder
  const incrementViewCount = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/videos/${videoId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        console.log('✅ View count incremented successfully')
        // Local state'i de güncelle
        if (video) {
          setVideo({
            ...video,
            views: (video.views || 0) + 1
          })
        }
      }
    } catch (error) {
      console.error('❌ Failed to increment view count:', error)
    }
  }

  const handlePlay = () => {
    setIsPlaying(true)
    // Video oynatıldığında view count'ı artır
    incrementViewCount()
  }
  const handlePause = () => setIsPlaying(false)
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setCurrentTime(state.playedSeconds)
  }
  const handleDuration = (duration: number) => setDuration(duration)
  const handleSeek = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds)
    }
  }
  const toggleMute = () => setIsMuted(!isMuted)
  const toggleFullscreen = () => {
    if (playerRef.current) {
      const playerElement = playerRef.current.getInternalPlayer()
      if (playerElement && playerElement.requestFullscreen) {
        playerElement.requestFullscreen()
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Video barkirin...</p>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-white text-2xl mb-2">Video Bulunamadı</h1>
          <p className="text-gray-400">{error || 'Video mevcut değil'}</p>
        </div>
      </div>
    )
  }

  const isMovie = 'videoUrl' in video || 'videoPath' in video

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Section */}
      <section className="relative h-[70vh] bg-black">
        <div className="relative w-full h-full">
          {/* React Player */}
                               <ReactPlayer
            ref={playerRef}
            url={isMovie ? (video.videoUrl || video.videoPath ? `http://localhost:3005${video.videoUrl || video.videoPath}` : undefined) : undefined}
             playing={isPlaying}
             muted={isMuted}
             width="100%"
             height="100%"
             onPlay={handlePlay}
             onPause={handlePause}
             onProgress={handleProgress}
             onDuration={handleDuration}
             controls={false}
             style={{ objectFit: 'cover' }}
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                {(video.thumbnail || video.thumbnailUrl || video.thumbnailPath) && (
                  <img 
                    src={getSafeImageUrl(video.thumbnail || video.thumbnailUrl || video.thumbnailPath, 800, 600, 'poster')} 
                    alt={video.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                                     <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                     className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 shadow-2xl"
                     onClick={() => {
                       if (!isPlaying) {
                         // Video oynatıldığında view count'ı artır
                         incrementViewCount()
                       }
                       setIsPlaying(!isPlaying)
                     }}
                   >
                     {isPlaying ? (
                       <Pause className="w-12 h-12" />
                     ) : (
                       <Play className="w-12 h-12 ml-1" />
                     )}
                   </motion.button>
                </div>
              </div>
            }
          />

          {/* Custom Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                                 <button
                   onClick={() => {
                     if (!isPlaying) {
                       // Video oynatıldığında view count'ı artır
                       incrementViewCount()
                     }
                     setIsPlaying(!isPlaying)
                   }}
                   className="text-white hover:text-red-500 transition-colors"
                 >
                   {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                 </button>
                
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                
                <div className="text-white text-sm">
                  {formatDuration(currentTime)} / {formatDuration(duration)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="text-white hover:text-red-500 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
                <button className="text-white hover:text-red-500 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
                <button className="text-white hover:text-red-500 transition-colors">
                  <Download className="w-6 h-6" />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:text-red-500 transition-colors"
                >
                  <Maximize className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Info Section */}
      <section className="py-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Details */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex items-center gap-6 text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>{video.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span>{formatViewCount(video.views || 0)} temaşe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{formatDuration(video.duration || 0)}</span>
                  </div>
                  {video.year && (
                    <span>{video.year}</span>
                  )}
                </div>

                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  {video.description}
                </p>

                {/* Genre Tags */}
                {video.genre && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {(typeof video.genre === 'string' ? JSON.parse(video.genre) : video.genre).map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-slate-800 text-white rounded-full text-sm"
                      >
                         {genre}
                       </span>
                     ))}
                   </div>
                 )}

                {/* Movie/Series Specific Info */}
                {isMovie && video.director && (
                  <div className="mb-4">
                    <span className="text-gray-400">Direktor: </span>
                    <span className="text-white">{video.director}</span>
                  </div>
                )}

                {isMovie && video.cast && video.cast.length > 0 && (
                  <div className="mb-4">
                    <span className="text-gray-400">Aktor: </span>
                    <span className="text-white">{video.cast.join(', ')}</span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-slate-900/50 rounded-xl p-6 backdrop-blur-sm border border-slate-700/30"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Çavkaniyên Têkildar</h3>
                
                {relatedVideos.length > 0 ? (
                  <div className="space-y-4">
                    {relatedVideos.map((relatedVideo) => (
                      <VideoCard
                        key={relatedVideo.id}
                        id={relatedVideo.id}
                        title={relatedVideo.title}
                        description={relatedVideo.description}
                        thumbnail={relatedVideo.thumbnail || relatedVideo.thumbnailUrl || relatedVideo.thumbnailPath}
                        duration={relatedVideo.duration}
                        rating={relatedVideo.rating}
                        views={relatedVideo.views}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-8">
                    Hîn çavkaniyên têkildar nehatine zêdekirin
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
