'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Film, Heart, Zap, Map, Smile, Ghost, Microscope, BookOpen } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  videoCount: number
  color: string
}

export function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories: Category[] = [
    {
      id: '1',
      name: 'Drama',
      description: 'Fîlmên dramatîk û hêstbizin',
      icon: Film,
      videoCount: 45,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: '2',
      name: 'Komedy',
      description: 'Fîlmên komedî û xweşbêj',
      icon: Smile,
      videoCount: 32,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: '3',
      name: 'Aksiyon',
      description: 'Fîlmên aksiyon û tirsnak',
      icon: Zap,
      videoCount: 28,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: '4',
      name: 'Serkeftin',
      description: 'Fîlmên serkeftin û macera',
      icon: Map,
      videoCount: 19,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: '5',
      name: 'Hêstbizin',
      description: 'Fîlmên hêstbizin û evîn',
      icon: Heart,
      videoCount: 23,
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: '6',
      name: 'Tirs',
      description: 'Fîlmên tirs û suspense',
      icon: Ghost,
      videoCount: 15,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: '7',
      name: 'Zanistî',
      description: 'Fîlmên zanistî û teknolojî',
      icon: Microscope,
      videoCount: 12,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: '8',
      name: 'Dîrokî',
      description: 'Fîlmên dîrokî û kevneşopî',
      icon: BookOpen,
      videoCount: 18,
      color: 'from-amber-500 to-yellow-500'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50">
      <div className="px-8 max-w-7xl mx-auto">
        {/* Modern section header with enhanced styling */}
        <motion.div 
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4">
            {/* Modern category icon */}
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <Film className="w-7 h-7 text-white" />
            </motion.div>
            
            {/* Enhanced title section */}
            <div>
              <h2 className="text-4xl font-bold text-white tracking-tight mb-2">
                Kategorî
              </h2>
              <p className="text-slate-400 text-lg font-medium">
                Herî baştirîn naverokên kurdî û cîhanî
              </p>
            </div>
          </div>
          
          {/* Modern navigation arrows */}
          <div className="flex items-center gap-3">
            <motion.button 
              className="p-3 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 shadow-lg"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="p-3 bg-slate-800/40 backdrop-blur-sm hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-600/30 hover:border-slate-500/50 shadow-lg"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
        
        {/* Modern category grid with enhanced cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <motion.button
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative w-full p-6 rounded-2xl transition-all duration-300 text-center overflow-hidden ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white transform scale-105 shadow-2xl shadow-red-500/25'
                      : 'bg-slate-800/40 backdrop-blur-sm text-slate-300 hover:text-white hover:scale-105 hover:bg-slate-700/60 border border-slate-600/30 hover:border-slate-500/50'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background gradient overlay */}
                  {selectedCategory === category.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <motion.div 
                    className={`relative mb-4 mx-auto w-16 h-16 rounded-2xl flex items-center justify-center ${
                      selectedCategory === category.id 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : `bg-gradient-to-br ${category.color}`
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="font-bold text-sm mb-2 group-hover:text-white transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-xs opacity-75 mb-3 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                  
                  {/* Video count badge */}
                  <motion.span 
                    className={`inline-block text-xs px-3 py-1.5 rounded-full font-semibold ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {category.videoCount} video
                  </motion.span>
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Modern "Explore All" button */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl transition-all duration-300 font-semibold text-lg shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Hemû Kategorîyên Keşf Et →
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
