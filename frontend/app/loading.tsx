'use client'

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-500 mb-4 animate-pulse">
          FILMXANE
        </div>
        <div className="animate-spin w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white text-lg">Naverok tê barkirin...</p>
      </div>
    </div>
  )
}
