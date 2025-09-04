'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-500 mb-4">500</h1>
        <h2 className="text-2xl text-white mb-4">Çewtiyek çêbû</h2>
        <p className="text-gray-400 mb-8">Di serwera me de çewtiyek çêbû.</p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-red-600 text-white rounded-lg mr-4"
        >
          Dîsa Biceribîne
        </button>
        <a href="/" className="px-8 py-3 bg-gray-700 text-white rounded-lg">
          Vegere Serê Malê
        </a>
      </div>
    </div>
  )
}
