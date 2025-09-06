import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fallback görsel sistemi
export const fallbackImages = {
  thumbnail: 'https://via.placeholder.com/300x200/1f1f1f/ffffff?text=Filmxane',
  poster: 'https://via.placeholder.com/400x600/1f1f1f/ffffff?text=Filmxane',
  avatar: 'https://via.placeholder.com/100x100/1f1f1f/ffffff?text=F'
}

// Netflix tarzı görsel placeholder URL'leri
export const getPlaceholderImage = (width: number, height: number, text?: string) => {
  const encodedText = text ? encodeURIComponent(text) : 'Filmxane'
  return `https://via.placeholder.com/${width}x${height}/1f1f1f/ffffff?text=${encodedText}`
}

// Alternatif placeholder servisleri
export const getRandomPlaceholderImage = (width: number, height: number) => {
  const services = [
    `https://picsum.photos/${width}/${height}?random=${Math.random()}`,
    `https://source.unsplash.com/${width}x${height}/?movie,cinema`,
    `https://via.placeholder.com/${width}x${height}/1f1f1f/ffffff?text=Filmxane`
  ]
  return services[Math.floor(Math.random() * services.length)]
}

// Güvenli görsel URL'i - hata durumunda fallback döner
export const getSafeImageUrl = (url: string | null | undefined, width: number, height: number, fallbackType: keyof typeof fallbackImages = 'thumbnail') => {
  if (!url) return fallbackImages[fallbackType]
  
  // Eğer relative path ise (uploads/...), backend URL'ini ekle
  if (url.startsWith('/uploads/')) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? '/api' 
        : 'http://localhost:3005/api')
    return API_BASE_URL.replace('/api', '') + url
  }
  
  try {
    // URL geçerli mi kontrol et
    new URL(url)
    return url
  } catch {
    // Geçersiz URL ise fallback döner
    return fallbackImages[fallbackType]
  }
}

// Netflix tarzı grid breakpoint'leri
export const gridBreakpoints = {
  xs: 'grid-cols-2',
  sm: 'grid-cols-3',
  md: 'grid-cols-4',
  lg: 'grid-cols-5',
  xl: 'grid-cols-6',
  '2xl': 'grid-cols-7'
}

// Responsive grid class'ları
export const getResponsiveGridClass = () => {
  return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7'
}

// Object render hatalarını önlemek için güvenli string dönüştürme
export const safeString = (value: any): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value ? 'Hêye' : 'Nîne'
  if (Array.isArray(value)) return value.join(', ')
  if (value && typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch {
      return 'Object'
    }
  }
  return 'N/A'
}

// Netflix tarzı hover efektleri - Birleştirilmiş versiyon
export const netflixHoverEffects = {
  image: 'group-hover:scale-110 transition-transform duration-300',
  overlay: 'group-hover:opacity-0 transition-opacity duration-300',
  card: 'group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300',
  shadow: 'group-hover:shadow-2xl transition-shadow duration-300',
  text: 'group-hover:text-white transition-colors duration-300',
  scale: 'hover:scale-105 hover:z-10 transition-all duration-300 ease-out'
}
