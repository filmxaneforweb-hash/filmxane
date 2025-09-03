import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">
          Rûpel nehat dîtin
        </h2>
        <p className="text-gray-400 mb-8">
          Rûpelê ku hûn lê digerin nehat dîtin.
        </p>
        <Link 
          href="/"
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Vegere Serê Malê
        </Link>
      </div>
    </div>
  )
}
