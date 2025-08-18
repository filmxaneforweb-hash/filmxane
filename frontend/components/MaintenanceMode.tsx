'use client'

import { useSettings } from '@/contexts/SettingsContext'
import { motion } from 'framer-motion'
import { Wrench, Clock, Mail } from 'lucide-react'

export const MaintenanceMode: React.FC = () => {
  // Geçici olarak devre dışı bırakıldı
  return null
  
  const { settings } = useSettings()

  // Sadece maintenance mode aktifse göster
  if (!settings?.maintenanceMode || settings.maintenanceMode === false) {
    return null
  }

  // Settings yüklenmemişse gösterme
  if (!settings) {
    return null
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-md flex items-center justify-center pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-800 rounded-3xl p-8 max-w-md mx-4 text-center border border-slate-600 shadow-2xl"
      >
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          {settings.siteName || 'Filmxane'} Bakımda
        </h1>
        
        <p className="text-slate-300 mb-6 leading-relaxed">
          {settings.siteDescription || 'Site şu anda bakımda. Lütfen daha sonra tekrar deneyin.'}
        </p>
        
        <div className="space-y-4 text-sm text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Bakım süresi: 2-3 saat</span>
          </div>
          
          {settings.contactEmail && (
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <span>İletişim: {settings.contactEmail}</span>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-slate-700/50 rounded-xl">
          <p className="text-slate-300 text-sm">
            Bu süre zarfında yeni içerikler ekleniyor ve sistem iyileştirmeleri yapılıyor. 
            Daha iyi bir deneyim için çalışıyoruz! 🚀
          </p>
        </div>
      </motion.div>
    </div>
  )
}
