'use client'

import { HeroSection } from '@/components/HeroSection'
import { ContentGrid } from '@/components/ContentGrid'
import { useContent } from '@/contexts/ContentContext'
import { motion, AnimatePresence } from 'framer-motion'
import { getSafeImageUrl } from '@/lib/utils'
import { useState } from 'react'
import { X, Star, Calendar, Clock, Award, Users, Film, Eye, Heart, Share2 } from 'lucide-react'

export default function HomePage() {
  const { 
    movies, 
    series, 
    featuredContent, 
    newReleases, 
    isLoading 
  } = useContent()

  const [showInfoModal, setShowInfoModal] = useState(false)

  // Loading state'inde sadece basit loading göster
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-lg">Naverok tê barkirin...</p>
        </div>
      </div>
    )
  }

  const featuredMovie = movies && movies.length > 0 ? movies[0] : null

  return (
    <div className="min-h-screen bg-black">
      {/* Netflix Tarzında Hero Alanı - Sadece film varsa göster */}
      {movies && movies.length > 0 && movies[0] && (
        <section className="relative h-screen overflow-hidden">
          {/* Background Movie Poster */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${getSafeImageUrl(movies[0]?.thumbnailUrl || movies[0]?.posterUrl || movies[0]?.thumbnail, 1920, 1080, 'thumbnail')}')` 
            }}
          />
          
          {/* Dark Overlay - Netflix Style */}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-end px-8 pb-20">
            {/* Movie Info */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-4xl"
            >
              {/* Movie Title */}
              <motion.h1
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
                style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  lineHeight: '0.9'
                }}
              >
                {movies[0]?.title}
              </motion.h1>

              {/* Movie Meta Info */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="flex items-center space-x-6 text-gray-300 mb-6 text-lg"
              >
                {movies[0]?.rating && (
                  <span className="flex items-center">
                    <span className="text-green-400 mr-2">●</span>
                    {movies[0]?.rating}
                  </span>
                )}
                {movies[0]?.year && (
                  <span>{movies[0]?.year}</span>
                )}
                {movies[0]?.duration && (
                  <span>
                    {movies[0]?.duration > 60 ? 
                      `${Math.floor((movies[0]?.duration || 0) / 60)}d ${Math.floor((movies[0]?.duration || 0) % 60)}m` : 
                      `${Math.floor((movies[0]?.duration || 0))}s`
                    }
                  </span>
                )}
                <span className="bg-gray-800 px-2 py-1 rounded text-sm">HD</span>
              </motion.div>

              {/* Movie Description */}
              <motion.p
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl text-gray-300 mb-8 max-w-3xl leading-relaxed"
              >
                {movies[0]?.description || 'Ji bo agahiyên zêdetir li ser vê fîlmê bikirtînin.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = `/videos/${movies[0]?.id}`}
                  className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors text-lg flex items-center justify-center cursor-pointer"
                >
                  <span className="mr-2">▶️</span>
                  Bixwîne
                </motion.button>
                
                {/* Fragman Butonu - Sadece Filmler İçin */}
                {movies[0]?.type === 'movie' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = `/videos/${movies[0]?.id}?trailer=true`}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg flex items-center justify-center cursor-pointer"
                  >
                    <span className="mr-2">🎬</span>
                    Fragmanê Bixwîne
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInfoModal(true)}
                  className="px-8 py-4 bg-gray-600/80 text-white rounded-lg font-semibold hover:bg-gray-500/80 transition-colors text-lg flex items-center justify-center backdrop-blur-sm cursor-pointer"
                >
                  <span className="mr-2">ℹ️</span>
                  Agahiyên Zêdetir
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </section>
      )}

      {/* Content Sections */}
      <div className="space-y-8">
        {/* New Releases */}
        {newReleases && newReleases.length > 0 && (
          <ContentGrid
            title="Nû Hat"
            subtitle="Çîroka nû ya ciwan"
            items={newReleases}
            showViewAll
            viewAllLink="/videos"
          />
        )}

        {/* Featured Movies */}
        {movies && movies.filter(m => m.isFeatured)?.length > 0 && (
          <ContentGrid
            title="Fîlmên Taybet"
            subtitle="Çîroka herî baş"
            items={movies.filter(m => m.isFeatured)}
            showViewAll
            viewAllLink="/movies"
          />
        )}

        {/* Featured Series */}
        {series && series.filter(s => s.isFeatured)?.length > 0 && (
          <ContentGrid
            title="Rêzefîlmên Taybet"
            subtitle="Çîroka herî baş"
            items={series.filter(s => s.isFeatured)}
            showViewAll
            viewAllLink="/series"
          />
        )}

        {/* Action Movies */}
        {movies && movies.filter(m => {
          if (!m.genre) return false
          const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
          return genres.includes('Action')
        })?.length > 0 && (
          <ContentGrid
            title="Fîlmên Çalakî"
            subtitle="Hêz û lez"
            items={movies.filter(m => {
              if (!m.genre) return false
              const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
              return genres.includes('Action')
            })}
            showViewAll
            viewAllLink="/movies?genre=Action"
          />
        )}

        {/* Drama Series */}
        {series && series.filter(s => {
          if (!s.genre) return false
          const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : m.genre
          return genres.includes('Drama')
        })?.length > 0 && (
          <ContentGrid
            title="Rêzefîlmên Dramayê"
            subtitle="Hêstir û keştiş"
            items={series.filter(s => {
              if (!s.genre) return false
              const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : m.genre
              return genres.includes('Drama')
            })}
            showViewAll
            viewAllLink="/series?genre=Drama"
          />
        )}

        {/* Comedy Movies */}
        {movies && movies.filter(m => {
          if (!m.genre) return false
          const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
          return genres.includes('Comedy')
        })?.length > 0 && (
          <ContentGrid
            title="Fîlmên Komedî"
            subtitle="Ken û kêf"
            items={movies.filter(m => {
              if (!m.genre) return false
              const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
              return genres.includes('Comedy')
            })}
            showViewAll
            viewAllLink="/movies?genre=Comedy"
          />
        )}

        {/* Horror Movies */}
        {movies && movies.filter(m => {
          if (!m.genre) return false
          const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
          return genres.includes('Horror')
        })?.length > 0 && (
          <ContentGrid
            title="Fîlmên Tirsê"
            subtitle="Tirs û heyecan"
            items={movies.filter(m => {
              if (!m.genre) return false
              const genres = typeof m.genre === 'string' ? JSON.parse(m.genre) : m.genre
              return genres.includes('Horror')
            })}
            showViewAll
            viewAllLink="/movies?genre=Horror"
          />
        )}

        {/* Documentary Series */}
        {series && series.filter(s => {
          if (!s.genre) return false
          const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : m.genre
          return genres.includes('Documentary')
        })?.length > 0 && (
          <ContentGrid
            title="Rêzefîlmên Belgeyî"
            subtitle="Rastiyên cîhanê"
            items={series.filter(s => {
              if (!s.genre) return false
              const genres = typeof s.genre === 'string' ? JSON.parse(s.genre) : m.genre
              return genres.includes('Documentary')
            })}
            showViewAll
            viewAllLink="/series?genre=Documentary"
          />
        )}


      </div>

      {/* Enhanced Info Modal */}
      <AnimatePresence>
        {showInfoModal && featuredMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700/30"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Movie Poster */}
              <div className="relative">
                <div className="h-64 bg-cover bg-center bg-no-repeat rounded-t-3xl relative"
                     style={{ 
                       backgroundImage: `url('${getSafeImageUrl(featuredMovie.thumbnailUrl || featuredMovie.posterUrl || featuredMovie.thumbnail, 1200, 400, 'poster')}')` 
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
                  
                  {/* Close Button */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInfoModal(false)}
                    className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors p-2 bg-black/30 rounded-full backdrop-blur-sm"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  {/* Movie Title Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
                      {featuredMovie.title}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-300">
                      {featuredMovie.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          <span className="font-semibold">{featuredMovie.rating}</span>
                        </div>
                      )}
                      {featuredMovie.year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span>{featuredMovie.year}</span>
                        </div>
                      )}
                      {featuredMovie.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-green-400" />
                          <span>{Math.floor(featuredMovie.duration / 60)}d</span>
                        </div>
                      )}
                      <span className="bg-red-600 px-3 py-1 rounded text-sm font-semibold">HD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    {featuredMovie.description && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                                 <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                           <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                           Daxuyanî
                         </h3>
                        <p className="text-gray-300 text-lg leading-relaxed">
                          {featuredMovie.description}
                        </p>
                      </div>
                    )}

                    {/* Genre Tags */}
                    {featuredMovie.genre && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                                 <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                           <Award className="w-6 h-6 text-purple-400" />
                           Cureyên Fîlmê
                         </h3>
                        <div className="flex flex-wrap gap-3">
                          {(typeof featuredMovie.genre === 'string' ? JSON.parse(featuredMovie.genre) : featuredMovie.genre).map((genre: any, index: any) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-600/30 transition-colors cursor-pointer"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cast & Crew */}
                    {featuredMovie.director && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                                 <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                           <Users className="w-6 h-6 text-green-400" />
                           Derhêner
                         </h3>
                        <p className="text-gray-300 text-lg">{featuredMovie.director}</p>
                      </div>
                    )}

                    {featuredMovie.cast && featuredMovie.cast.length > 0 && (
                      <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                                 <h3 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                           <Users className="w-6 h-6 text-yellow-400" />
                           Lîstikvan
                         </h3>
                        <div className="flex flex-wrap gap-3">
                          {featuredMovie.cast.map((actor: any, index: any) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-yellow-600/20 text-yellow-400 rounded-full text-sm hover:bg-yellow-600/30 transition-colors cursor-pointer"
                            >
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Additional Info & Actions */}
                  <div className="space-y-6">
                    {/* Quick Stats */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                             <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                         <Film className="w-6 h-6 text-red-400" />
                         Agahiyên Bilez
                       </h3>
                      <div className="space-y-3">
                                                 <div className="flex items-center justify-between">
                           <span className="text-gray-400">Cure:</span>
                           <span className="text-white font-medium">Fîlm</span>
                         </div>
                         {featuredMovie.year && (
                           <div className="flex items-center justify-between">
                             <span className="text-gray-400">Sal:</span>
                             <span className="text-white font-medium">{featuredMovie.year}</span>
                           </div>
                         )}
                         {featuredMovie.duration && (
                           <div className="flex items-center justify-between">
                             <span className="text-gray-400">Dirêjahî:</span>
                             <span className="text-white font-medium">{Math.floor(featuredMovie.duration / 60)} deqîqe</span>
                           </div>
                         )}
                         {featuredMovie.rating && (
                           <div className="flex items-center justify-between">
                             <span className="text-gray-400">Nirx:</span>
                             <span className="text-white font-medium flex items-center gap-2">
                               <Star className="w-5 h-5 text-yellow-500 fill-current" />
                               {featuredMovie.rating}
                             </span>
                           </div>
                         )}

                      </div>
                    </div>

                    {/* Technical Info */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                             <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                         <span className="w-1 h-6 bg-green-500 rounded-full"></span>
                         Agahiyên Teknîkî
                       </h3>
                      <div className="space-y-3">
                                                 <div className="flex items-center justify-between">
                           <span className="text-gray-400">Kalîte:</span>
                           <span className="text-white font-medium bg-green-600/20 text-green-400 px-3 py-1 rounded-lg text-sm">
                             HD
                           </span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-gray-400">Format:</span>
                           <span className="text-white font-medium">MP4</span>
                         </div>
                         <div className="flex items-center justify-between">
                           <span className="text-gray-400">Çareserî:</span>
                           <span className="text-white font-medium">1920x1080</span>
                         </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/30">
                                             <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                         <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                         Çalakiyên Bilez
                       </h3>
                      <div className="space-y-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.location.href = `/videos/${featuredMovie.id}`}
                          className="w-full py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-3"
                        >
                          <span className="text-lg">▶️</span>
                          Fîlmê Bibîne
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: featuredMovie.title,
                                text: featuredMovie.description || `${featuredMovie.title} - Filmxane'de izle`,
                                url: window.location.href
                              })
                            } else {
                              navigator.clipboard.writeText(window.location.href)
                                                             alert('Lînk hatibe kopîkirin li panoyê!')
                            }
                          }}
                          className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
                        >
                          <Share2 className="w-5 h-5" />
                          Parve Bike
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
