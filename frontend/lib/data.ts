export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string | null
  duration?: number
  rating?: number
  viewCount?: number
  progress?: number
  category: string
  type: 'movie' | 'series' | 'documentary'
  language: string
  year?: number
}

export interface VideoCategory {
  id: string
  name: string
  title: string
  videos: Video[]
  showProgress?: boolean
}

// Mock data - Netflix tarzı içerik
export const mockVideos: Video[] = [
  // Featured Videos
  {
    id: '1',
    title: 'Destpêkeke Ciwan',
    description: 'Fîlmeke ciwan û balkêş',
    thumbnailUrl: null,
    duration: 7200,
    category: 'featured',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.5,
    viewCount: 1250
  },
  {
    id: '2',
    title: 'Çîrokeke Têkildar',
    description: 'Çîrokeke têkildar û balkêş',
    thumbnailUrl: null,
    duration: 5400,
    category: 'featured',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.2,
    viewCount: 890
  },
  {
    id: '3',
    title: 'Serkeftin',
    description: 'Fîlmeke serkeftin û balkêş',
    thumbnailUrl: null,
    duration: 6300,
    category: 'featured',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.7,
    viewCount: 2100
  },
  {
    id: '4',
    title: 'Hêstbizin',
    description: 'Fîlmeke hêstbizin û balkêş',
    thumbnailUrl: null,
    duration: 4800,
    category: 'featured',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.3,
    viewCount: 1560
  },
  {
    id: '5',
    title: 'Tirs',
    description: 'Fîlmeke tirs û balkêş',
    thumbnailUrl: null,
    duration: 5400,
    category: 'featured',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.6,
    viewCount: 980
  },
  {
    id: '6',
    title: 'Komedy',
    description: 'Fîlmeke komedî û balkêş',
    thumbnailUrl: null,
    duration: 4500,
    category: 'featured',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.1,
    viewCount: 3200
  },

  // Trending Videos
  {
    id: '7',
    title: 'Serkeftin',
    description: 'Fîlmeke serkeftin û balkêş',
    thumbnailUrl: null,
    duration: 7200,
    category: 'trending',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.5,
    viewCount: 2500
  },
  {
    id: '8',
    title: 'Hêstbizin',
    description: 'Fîlmeke hêstbizin û balkêş',
    thumbnailUrl: null,
    duration: 5400,
    category: 'trending',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.2,
    viewCount: 1800
  },
  {
    id: '9',
    title: 'Tirs',
    description: 'Fîlmeke tirs û balkêş',
    thumbnailUrl: null,
    duration: 6300,
    category: 'trending',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.7,
    viewCount: 3200
  },
  {
    id: '10',
    title: 'Komedy',
    description: 'Fîlmeke komedî û balkêş',
    thumbnailUrl: null,
    duration: 4800,
    category: 'trending',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.0,
    viewCount: 2100
  },
  {
    id: '11',
    title: 'Aksiyon',
    description: 'Fîlmeke aksiyon û balkêş',
    thumbnailUrl: null,
    duration: 6600,
    category: 'trending',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.8,
    viewCount: 4100
  },
  {
    id: '12',
    title: 'Drama',
    description: 'Fîlmeke dramatîk û balkêş',
    thumbnailUrl: null,
    duration: 5700,
    category: 'trending',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.3,
    viewCount: 1900
  },

  // Continue Watching
  {
    id: '13',
    title: 'Destpêkeke Ciwan',
    description: 'Fîlmeke ciwan û balkêş',
    thumbnailUrl: null,
    duration: 7200,
    category: 'continue',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.6,
    viewCount: 3200,
    progress: 65
  },
  {
    id: '14',
    title: 'Çîrokeke Têkildar',
    description: 'Çîrokeke têkildar û balkêş',
    thumbnailUrl: null,
    duration: 5400,
    category: 'continue',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.1,
    viewCount: 2100,
    progress: 30
  },
  {
    id: '15',
    title: 'Serkeftin',
    description: 'Fîlmeke serkeftin û balkêş',
    thumbnailUrl: null,
    duration: 6300,
    category: 'continue',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.4,
    viewCount: 2800,
    progress: 80
  },
  {
    id: '16',
    title: 'Hêstbizin',
    description: 'Fîlmeke hêstbizin û balkêş',
    thumbnailUrl: null,
    duration: 4800,
    category: 'continue',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.3,
    viewCount: 1900,
    progress: 45
  },
  {
    id: '17',
    title: 'Tirs',
    description: 'Fîlmeke tirs û balkêş',
    thumbnailUrl: null,
    duration: 5400,
    category: 'continue',
    type: 'movie',
    language: 'Kurdî',
    year: 2024,
    rating: 4.7,
    viewCount: 3500,
    progress: 20
  },
  {
    id: '18',
    title: 'Komedy',
    description: 'Fîlmeke komedî û balkêş',
    thumbnailUrl: null,
    duration: 4500,
    category: 'continue',
    type: 'series',
    language: 'Kurdî',
    year: 2024,
    rating: 4.0,
    viewCount: 1600,
    progress: 90
  }
]

// Kategorilere göre videoları grupla
export const getVideosByCategory = (category: string): Video[] => {
  return mockVideos.filter(video => video.category === category)
}

// Tüm kategorileri getir
export const getVideoCategories = (): VideoCategory[] => {
  return [
    {
      id: 'trending',
      name: 'trending',
      title: 'Niha Têne Dîtin',
      videos: getVideosByCategory('trending'),
      showProgress: false
    },
    {
      id: 'featured',
      name: 'featured',
      title: 'Fîlmên Têne Hilbijartin',
      videos: getVideosByCategory('featured'),
      showProgress: false
    },
    {
      id: 'continue',
      name: 'continue',
      title: 'Bidomîne Temaşe',
      videos: getVideosByCategory('continue'),
      showProgress: true
    }
  ]
}

// Hero için öne çıkan video
export const getFeaturedVideo = (): Video => {
  return mockVideos.find(video => video.id === '1') || mockVideos[0]
}
