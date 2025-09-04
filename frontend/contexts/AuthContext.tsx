'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { apiClient, User, AuthResponse } from '@/lib/api'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          setIsLoading(false)
          return
        }

        const token = localStorage.getItem('filmxane_token')
        if (token) {
          // Verify token and get user profile
          const response = await apiClient.getProfile()
          if (response.success && response.data) {
            setUser(response.data)
          } else {
            // Token is invalid, clear it
            apiClient.clearToken()
            localStorage.removeItem('filmxane_refresh_token')
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        apiClient.clearToken()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('filmxane_refresh_token')
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.login(email, password)
      
      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data
        
        // Set token in API client
        apiClient.setToken(token)
        
        // Store refresh token
        if (refreshToken && typeof window !== 'undefined') {
          localStorage.setItem('filmxane_refresh_token', refreshToken)
        }
        
        // Update user state
        setUser(userData)
        
        // Store user data in localStorage for profile page
        if (typeof window !== 'undefined') {
          localStorage.setItem('filmxane_user_firstName', userData.firstName || userData.name?.split(' ')[0] || 'User')
          localStorage.setItem('filmxane_user_lastName', userData.lastName || userData.name?.split(' ')[1] || '')
          localStorage.setItem('filmxane_user_email', userData.email)
          localStorage.setItem('filmxane_user_joinDate', userData.createdAt || new Date().toISOString())
          console.log('✅ Kullanıcı verileri localStorage\'a kaydedildi')
        }
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error || 'Login failed' 
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.register(firstName, lastName, email, password)
      
      if (response.success && response.data) {
        const { user: userData, token, refreshToken } = response.data
        
        // Set token in API client
        apiClient.setToken(token)
        
        // Store refresh token
        if (refreshToken && typeof window !== 'undefined') {
          localStorage.setItem('filmxane_refresh_token', refreshToken)
        }
        
        // Update user state
        setUser(userData)
        
        // Store user data in localStorage for profile page
        if (typeof window !== 'undefined') {
          localStorage.setItem('filmxane_user_firstName', userData.firstName || userData.name?.split(' ')[0] || 'User')
          localStorage.setItem('filmxane_user_lastName', userData.lastName || userData.name?.split(' ')[1] || '')
          localStorage.setItem('filmxane_user_email', userData.email)
          localStorage.setItem('filmxane_user_joinDate', userData.createdAt || new Date().toISOString())
          console.log('✅ Kullanıcı verileri localStorage\'a kaydedildi (register)')
        }
        
        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error || 'Registration failed' 
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if user is authenticated
      if (user) {
        await apiClient.logout()
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local state regardless of API call success
      setUser(null)
      apiClient.clearToken()
      if (typeof window !== 'undefined') {
        // Tüm localStorage verilerini temizle
        localStorage.removeItem('filmxane_token')
        localStorage.removeItem('filmxane_refresh_token')
        localStorage.removeItem('filmxane_user_firstName')
        localStorage.removeItem('filmxane_user_lastName')
        localStorage.removeItem('filmxane_user_email')
        localStorage.removeItem('filmxane_user_joinDate')
        console.log('✅ Tüm kullanıcı verileri temizlendi')
      }
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    try {
      if (!user) return
      
      const response = await apiClient.getProfile()
      if (response.success && response.data) {
        setUser(response.data)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
    }
  }

  // Update user data locally
  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  // Auto-refresh token before it expires
  useEffect(() => {
    if (!user) return

    const tokenRefreshInterval = setInterval(async () => {
      try {
        const response = await apiClient.refreshToken()
        if (response.success && response.data) {
          apiClient.setToken(response.data.token)
        } else {
          // Refresh failed, logout user
          await logout()
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        await logout()
      }
    }, 14 * 60 * 1000) // Refresh every 14 minutes (assuming 15-minute token expiry)

    return () => clearInterval(tokenRefreshInterval)
  }, [user])

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
