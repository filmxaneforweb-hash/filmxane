'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  apiClient, 
  Movie, 
  Series, 
  Category, 
  SearchFilters, 
  SearchResponse 
} from '@/lib/api'

interface ContentContextType {
  // State
  movies: Movie[]
  series: Series[]
  categories: Category[]
  featuredContent: (Movie | Series)[]
  newReleases: (Movie | Series)[]
  isLoading: boolean
  searchResults: SearchResponse | null
  
  // Actions
  fetchMovies: (filters?: SearchFilters) => Promise<void>
  fetchSeries: (filters?: SearchFilters) => Promise<void>
  fetchCategories: () => Promise<void>
  searchContent: (query: string, filters?: SearchFilters) => Promise<void>
  clearSearch: () => void
  getContentByCategory: (categorySlug: string) => (Movie | Series)[]
  getRelatedContent: (contentId: string, contentType: 'movie' | 'series') => (Movie | Series)[]
}

const ContentContext = createContext<ContentContextType | undefined>(undefined)

export const useContent = () => {
  const context = useContext(ContentContext)
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

interface ContentProviderProps {
  children: ReactNode
}

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [series, setSeries] = useState<Series[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredContent, setFeaturedContent] = useState<(Movie | Series)[]>([])
  const [newReleases, setNewReleases] = useState<(Movie | Series)[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCategories()
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch movies with optional filters
  const fetchMovies = async (filters?: SearchFilters) => {
    try {
      setIsLoading(true)
      // Doğrudan tüm videoları getir ve movie tipini filtrele
      const response = await fetch('http://localhost:3005/api/videos')
      if (response.ok) {
        const allVideos = await response.json()
        const movieVideos = allVideos.filter((v: any) => v.type === 'movie')
        setMovies(movieVideos as Movie[])
        
        // Update featured and new releases
        updateFeaturedAndNewReleases()
      }
    } catch (error) {
      console.error('Failed to fetch movies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch series with optional filters
  const fetchSeries = async (filters?: SearchFilters) => {
    try {
      setIsLoading(true)
      // Doğrudan tüm videoları getir ve series tipini filtrele
      const response = await fetch('http://localhost:3005/api/videos')
      if (response.ok) {
        const allVideos = await response.json()
        const seriesVideos = allVideos.filter((v: any) => v.type === 'series')
        setSeries(seriesVideos as Series[])
        
        // Update featured and new releases
        updateFeaturedAndNewReleases()
      }
    } catch (error) {
      console.error('Failed to fetch series:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search content
  const searchContent = async (query: string, filters?: SearchFilters) => {
    try {
      setIsLoading(true)
      const response = await apiClient.searchContent(query, filters)
      if (response.success && response.data) {
        setSearchResults(response.data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear search results
  const clearSearch = () => {
    setSearchResults(null)
  }

  // Get content by category
  const getContentByCategory = (categorySlug: string) => {
    const category = categories?.find(cat => cat.slug === categorySlug)
    if (!category) return []

    const allContent = [...(movies || []), ...(series || [])]
    return allContent.filter(content => {
      if (!content.genre) return false
      
      // Genre'ları güvenli şekilde işle
      const contentGenres = Array.isArray(content.genre) 
        ? content.genre 
        : typeof content.genre === 'string' 
          ? JSON.parse(content.genre) 
          : []
      
            return contentGenres.some((genre: any) =>
        genre.toLowerCase() === category.name.toLowerCase()
      )
    })
  }

  // Get related content
  const getRelatedContent = (contentId: string, contentType: 'movie' | 'series') => {
    const currentContent = contentType === 'movie' 
      ? movies?.find(m => m.id === contentId)
      : series?.find(s => s.id === contentId)
    
    if (!currentContent) return []

    const allContent = [...(movies || []), ...(series || [])]
    return allContent
      .filter(content => {
        if (content.id === contentId) return false
        if (!content.genre || !currentContent.genre) return false
        
        try {
          // Genre'ları güvenli şekilde parse et
          const contentGenres = Array.isArray(content.genre) 
            ? content.genre 
            : typeof content.genre === 'string' 
              ? JSON.parse(content.genre) 
              : []
          
          const currentGenres = Array.isArray(currentContent.genre) 
            ? currentContent.genre 
            : typeof currentContent.genre === 'string' 
              ? JSON.parse(currentContent.genre) 
              : []
          
          return contentGenres.some((genre: any) => currentGenres.includes(genre))
        } catch (error) {
          console.error('❌ Error parsing genre:', error)
          return false
        }
      })
      .slice(0, 6) // Return max 6 related items
  }

  // Update featured and new releases
  const updateFeaturedAndNewReleases = () => {
    const allContent = [...(movies || []), ...(series || [])]
    
    // Featured content (high rating and views)
    const featured = allContent
      .filter(content => content.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
    
    setFeaturedContent(featured)
    
    // New releases (recent content)
    const newReleases = allContent
      .filter(content => content.isNew)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    
    setNewReleases(newReleases)
  }

  // Initialize content on mount
  useEffect(() => {
    const initializeContent = async () => {
      try {
        setIsLoading(true)
        console.log('🚀 Initializing content...')
        
        // Timeout ekle - 1 saniye sonra loading'i kapat
        const timeoutId = setTimeout(() => {
          console.log('⏰ Timeout reached, stopping loading')
          setIsLoading(false)
        }, 1000)
        
        // Fetch categories first
        await fetchCategories()
        
        // Then fetch movies and series
        await Promise.all([
          fetchMovies(),
          fetchSeries()
        ])
        
        clearTimeout(timeoutId)
        console.log('✅ Content initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize content:', error)
        // Set loading to false even on error
        setIsLoading(false)
      }
    }

    initializeContent()
  }, [])

  const value: ContentContextType = {
    // State
    movies,
    series,
    categories,
    featuredContent,
    newReleases,
    isLoading,
    searchResults,
    
    // Actions
    fetchMovies,
    fetchSeries,
    fetchCategories,
    searchContent,
    clearSearch,
    getContentByCategory,
    getRelatedContent,
  }

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}
