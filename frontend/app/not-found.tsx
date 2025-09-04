import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-yellow-500 mb-4">404</h1>
        <p className="text-gray-400 mb-8">Sayfa bulunamadı.</p>
        <Link href="/" className="px-8 py-3 bg-gray-700 text-white rounded-lg">
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  )
}
