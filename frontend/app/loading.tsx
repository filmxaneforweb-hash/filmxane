'use client'

import { motion } from 'framer-motion'

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* Netflix style logo */}
        <div className="mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold text-red-600 mb-2"
          >
            Filmxane
          </motion.div>
          <p className="text-gray-400 text-sm">Kürtçe Streaming Platformu</p>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full"
          />
        </div>

        {/* Loading text */}
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-gray-400 text-lg"
        >
          Yükleniyor...
        </motion.p>

        {/* Loading dots */}
        <div className="flex justify-center mt-4 space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              className="w-2 h-2 bg-red-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
