'use client'

export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light text-white mb-8 tracking-tight">
          CSS Test Sayfası
        </h1>
        
        {/* Tailwind Test */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/30 backdrop-blur-sm">
            <h2 className="text-2xl font-medium text-white mb-4">Tailwind CSS Test</h2>
            <p className="text-slate-300 mb-4">
              Eğer bu kutu yuvarlak köşeli, şeffaf arka planlı ve border'lı görünüyorsa Tailwind çalışıyor.
            </p>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">
              Test Butonu
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-6 rounded-xl border border-indigo-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-medium text-white mb-4">Gradient Test</h2>
            <p className="text-slate-300 mb-4">
              Bu kutu gradient arka plan ve backdrop blur ile görünmeli.
            </p>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto"></div>
          </div>
        </div>
        
        {/* Responsive Grid Test */}
        <div className="bg-slate-800/30 p-6 rounded-xl border border-slate-700/30">
          <h2 className="text-2xl font-medium text-white mb-4">Responsive Grid Test</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-slate-700/50 h-20 rounded-lg flex items-center justify-center">
                <span className="text-slate-300 text-sm">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
