'use client'

// import { motion } from 'framer-motion' // SSR sorunu nedeniyle kaldırıldı
import { Play, Info, Star, Users } from 'lucide-react'
import Link from 'next/link'

interface HeroProps {
  featuredVideo?: {
    title: string
    description: string
    year?: number
    type: string
    language: string
    rating?: number
    duration?: number
    viewers?: number
  }
}

export function Hero({ featuredVideo }: HeroProps) {

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Modern Background with multiple layers */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
        
        {/* Animated mesh gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
        
        {/* Subtle noise texture - Fixed SVG parsing issue */}
        <div className="absolute inset-0 opacity-30">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Floating geometric elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-red-500/20 rounded-full opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 border border-blue-500/20 rounded-full opacity-20 animate-pulse" />

      {/* Main Content */}
      <div className="relative z-10 w-full px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Modern title with gradient text */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 tracking-tight">
            <span className="bg-gradient-to-r from-white via-red-100 to-red-200 bg-clip-text text-transparent">
              {featuredVideo ? featuredVideo.title : 'Filmxane'}
            </span>
          </h1>
          
          {/* Modern meta info with icons */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-300 mb-8">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{featuredVideo?.rating || '9.2'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <span>{featuredVideo?.viewers || '1.2M'}</span>
            </div>
            <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-xs font-medium">
              {featuredVideo?.year ? featuredVideo.year.toString() : '2024'}
            </div>
          </div>
          
          {/* Modern description */}
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
            {featuredVideo ? featuredVideo.description : 'Herî baştirîn fîlm û rêzefîlmên kurdî û cîhanî bibîne. Ji Netflix û HBO-yê zêdetir naverok.'}
          </p>

          {/* Modern action buttons with glassmorphism */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Watch Button - Dynamic routing based on featured video */}
            <Link href={featuredVideo ? 
              (featuredVideo.type === 'movie' ? '/movies' : '/series') : 
              '/videos'
            }>
              <button className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-2xl shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 hover:-translate-y-0.5 active:scale-98">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
                {featuredVideo ? 
                  (featuredVideo.type === 'movie' ? 'Fîlmên Bibîne' : 'Rêzefîlmên Bibîne') : 
                  'Fîlmên Bibîne'
                }
                <div
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, transparent 100%)' }}
                />
              </button>
            </Link>
            
            {/* Info Button - Dynamic routing */}
            <Link href={featuredVideo ? 
              (featuredVideo.type === 'movie' ? '/movies' : '/series') : 
              '/about'
            }>
              <button className="bg-slate-800/40 backdrop-blur-sm text-white hover:bg-slate-700/60 flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70 shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-98">
                <Info className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {featuredVideo ? 
                  (featuredVideo.type === 'movie' ? 'Fîlmên Zêdetir' : 'Rêzefîlmên Zêdetir') : 
                  'Derbarê Me'
                }
              </button>
            </Link>
          </div>

          {/* Modern scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center animate-bounce">
              <div className="w-1 h-3 bg-slate-400 rounded-full mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
