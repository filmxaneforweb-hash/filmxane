'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          Çewtiyek çêbû
        </h2>
        <p className="text-gray-400 mb-8">
          Di serwera me de çewtiyek çêbû. Ji kerema xwe dîsa biceribîne.
        </p>
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Dîsa Biceribîne
        </button>
      </div>
    </div>
  )
}
