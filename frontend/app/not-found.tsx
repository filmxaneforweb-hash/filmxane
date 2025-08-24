'use client'

import { motion } from 'framer-motion'
import { Search, Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Netflix style 404 icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-red-600">404</span>
          </div>
        </div>

        {/* 404 title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Rûpel Nehat Dîtin
        </h1>

        {/* 404 message */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          Rûpela ku hûn dixwazin mevcut nîne an jî hate guhertin. 
          Serê rûpelê biçin an jî lêbigere.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Serê Rûpelê
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Vegere
          </button>
        </div>

        {/* Search suggestion */}
        <div className="p-4 bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-300 mb-3">
            Naveroka ku hûn dixwazin nehat dîtin?
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
            Lêbigere
          </Link>
        </div>

        {/* Netflix style footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            Filmxane - Platforma Naveroka Kurdî
          </p>
        </div>
      </motion.div>
    </div>
  )
}
