// API Configuration - Fixed backend port
const API_BASE_URL = 'http://localhost:3005/api'

console.log('🔧 API Base URL set to:', API_BASE_URL)

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// Content Types
export interface Movie {
  id: string
  title: string
  titleKurdish: string
  description: string
  descriptionKurdish: string
  thumbnail: string
  poster: string
  thumbnailUrl?: string
  posterUrl?: string
  trailer: string
  videoUrl: string
  duration: number // in minutes
  rating: number
  year: number
  genre: string[]
  director: string
  cast: string[]
  language: string[]
  subtitles: string[]
  quality: 'HD' | '4K' | '1080p' | '720p'
  isFeatured: boolean
  isNew: boolean
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export interface Series {
  id: string
  title: string
  titleKurdish: string
  description: string
  descriptionKurdish: string
  thumbnail: string
  poster: string
  thumbnailUrl?: string
  posterUrl?: string
  trailer: string
  year: number
  genre: string[]
  director: string
  cast: string[]
  language: string[]
  subtitles: string[]
  quality: 'HD' | '4K' | '1080p' | '720p'
  isFeatured: boolean
  isNew: boolean
  views: number
  likes: number
  rating: number
  seasons: Season[]
  createdAt: string
  updatedAt: string
}

export interface Season {
  id: string
  number: number
  title: string
  episodes: Episode[]
}

export interface Episode {
  id: string
  number: number
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: number
  views: number
}

export interface Category {
  id: string
  name: string
  nameKurdish: string
  slug: string
  description: string
  icon: string
  color: string
  isActive: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  genre?: string[]
  year?: number[]
  quality?: string[]
  language?: string[]
  duration?: number[]
  rating?: number
  sortBy?: 'title' | 'year' | 'rating' | 'views' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SearchResponse {
  items: (Movie | Series)[]
  total: number
  page: number
  totalPages: number
  hasMore: boolean
}

// API Client Class
class ApiClient {
  private baseUrl: string
  private token: string | null

  constructor() {
    this.baseUrl = API_BASE_URL
    this.token = typeof window !== 'undefined' ? localStorage.getItem('filmxane_token') : null
    console.log('🔧 ApiClient initialized with baseUrl:', this.baseUrl)
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('filmxane_token', token)
    }
  }

  // Clear authentication token
  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('filmxane_token')
    }
  }

  // Get headers for authenticated requests
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Get fresh token from localStorage each time
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('filmxane_token') : null
    
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`
    }
    
    return headers
  }

  // Make HTTP request
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      
      // Debug logging
      console.log(`🚀 API Request: ${url}`)
      console.log(`📡 Base URL: ${this.baseUrl}`)
      console.log(`🔑 Token: ${this.token ? 'Present' : 'None'}`)
      
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      })

      console.log(`📊 Response status: ${response.status}`)
      console.log(`📊 Response ok: ${response.ok}`)

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken()
          console.log('❌ Authentication failed - clearing token')
          return {
            success: false,
            error: 'Authentication failed. Please login again.'
          }
        }
        
        // Try to get error message from response
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If we can't parse JSON, use status text
          errorMessage = response.statusText || `HTTP error! status: ${response.status}`
        }
        
        return {
          success: false,
          error: errorMessage
        }
      }

      const data = await response.json()
      console.log('✅ API Response data:', data)
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ API request failed:', error)
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Backend bağlantısı kurulamadı. Lütfen backend\'in çalıştığından emin olun.'
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      }
    }
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const payload = { email, password }
    console.log('🔐 Login payload:', { email, passwordLength: password?.length })
    
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const payload = { firstName, lastName, email, password }
    console.log('🚀 Register payload:', payload)
    
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    })
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = localStorage.getItem('filmxane_refresh_token')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    return this.request<{ token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    })
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me')
  }

  // Content APIs
  async getMovies(filters?: SearchFilters): Promise<ApiResponse<SearchResponse>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    return this.request<SearchResponse>(`/videos/type/movie?${params.toString()}`)
  }

  async getMovie(id: string): Promise<ApiResponse<Movie>> {
    return this.request<Movie>(`/movies/${id}`)
  }

  async getSeries(filters?: SearchFilters): Promise<ApiResponse<SearchResponse>> {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    return this.request<SearchResponse>(`/videos/type/series?${params.toString()}`)
  }

  async getSeriesDetail(id: string): Promise<ApiResponse<Series>> {
    return this.request<Series>(`/series/${id}`)
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/categories')
  }

  async searchContent(query: string, filters?: SearchFilters): Promise<ApiResponse<SearchResponse>> {
    const params = new URLSearchParams({ query })
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()))
          } else {
            params.append(key, value.toString())
          }
        }
      })
    }

    return this.request<SearchResponse>(`/search?${params.toString()}`)
  }

  // User Content APIs
  async getFavorites(): Promise<ApiResponse<(Movie | Series)[]>> {
    return this.request<(Movie | Series)[]>('/favorites/my-favorites')
  }

  async addToFavorites(contentId: string, contentType: 'movie' | 'series'): Promise<ApiResponse<void>> {
    return this.request<void>('/favorites', {
      method: 'POST',
      body: JSON.stringify({ videoId: contentId, type: contentType }),
    })
  }

  async removeFromFavorites(contentId: string): Promise<ApiResponse<void>> {
    return this.request<void>('/favorites', {
      method: 'DELETE',
      body: JSON.stringify({ videoId: contentId }),
    })
  }

  async getWatchHistory(): Promise<ApiResponse<(Movie | Episode)[]>> {
    return this.request<(Movie | Episode)[]>('/user/watch-history')
  }

  async updateWatchProgress(
    contentId: string,
    contentType: 'movie' | 'episode',
    progress: number
  ): Promise<ApiResponse<void>> {
    return this.request<void>('/user/watch-progress', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType, progress }),
    })
  }

  // Notification APIs
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.request<Notification[]>('/notifications')
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    })
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    return this.request<void>('/notifications/read-all', {
      method: 'PUT',
    })
  }

  // Admin APIs (only for admin users)
  async uploadContent(formData: FormData): Promise<ApiResponse<{ id: string }>> {
    return this.request<{ id: string }>('/admin/content/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set content-type for FormData
    })
  }

  async updateContent(id: string, data: Partial<Movie | Series>): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/content/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteContent(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/admin/content/${id}`, {
      method: 'DELETE',
    })
  }

  async getContentStats(): Promise<ApiResponse<{
    totalMovies: number
    totalSeries: number
    totalUsers: number
    totalViews: number
  }>> {
    return this.request('/admin/stats')
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Video Upload API
export const uploadVideo = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/videos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Video upload failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Video upload error:', error);
    throw error;
  }
};

export const getVideos = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

export const getVideosByType = async (type: 'movie' | 'series') => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/type/${type}`);
    if (!response.ok) throw new Error('Failed to fetch videos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};
