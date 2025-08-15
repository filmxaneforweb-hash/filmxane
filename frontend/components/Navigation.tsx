'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, User, Menu, Film } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  const [activeTab, setActiveTab] = useState('home')

  const tabs = [
    { id: 'home', label: 'Mal', href: '/' },
    { id: 'movies', label: 'Fîlm', href: '/movies' },
    { id: 'series', label: 'Rêzefîlm', href: '/series' },
    { id: 'new', label: 'Nû', href: '/new' },
    { id: 'mylist', label: 'Lîsta Min', href: '/mylist' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/30">
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo - Daha kaliteli ve sola çekildi */}
          <div className="flex items-center gap-12">
            <Link href="/" className="group">
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Logo Icon */}
                <div className="relative">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Film className="w-6 h-6 text-white" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                
                {/* Logo Text */}
                <motion.div className="flex flex-col">
                  <motion.span 
                    className="text-2xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors duration-300"
                    whileHover={{ x: 2 }}
                  >
                    Filmxane
                  </motion.span>
                  <motion.span 
                    className="text-xs text-slate-400 font-medium tracking-wider -mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    KURDISH CINEMA
                  </motion.span>
                </motion.div>
              </motion.div>
            </Link>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={tab.href}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 rounded-md hover:bg-slate-800/50"
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.button 
              className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {/* Notifications */}
            <motion.button 
              className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-4 h-4" />
            </motion.button>

            {/* User Profile */}
            <motion.button 
              className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <User className="w-4 h-4" />
            </motion.button>

            {/* Mobile Menu */}
            <motion.button 
              className="md:hidden p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}
