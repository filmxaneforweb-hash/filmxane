'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Error occurred:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Netflix style error icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Error title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Oops! Bir hata oluştu
        </h1>

        {/* Error message */}
        <p className="text-gray-400 mb-6 leading-relaxed">
          Maaf, bir şeyler ters gitti. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>

        {/* Error details (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg text-left">
            <p className="text-sm text-gray-300 mb-2">Hata detayları:</p>
            <code className="text-xs text-red-400 break-all">
              {error.message || 'Bilinmeyen hata'}
            </code>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-2">
                Hata ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        {/* Netflix style footer */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <p className="text-sm text-gray-500">
            Sorun devam ederse lütfen destek ekibimizle iletişime geçin
          </p>
        </div>
      </motion.div>
    </div>
  )
}
