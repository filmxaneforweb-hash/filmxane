'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl mb-6">Beklenmeyen bir hata oluştu</h2>
          <button
            onClick={() => reset()}
            className="px-8 py-3 bg-red-600 text-white rounded-lg"
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  )
}
