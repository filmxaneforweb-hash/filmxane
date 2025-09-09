'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  contactEmail: string
  maxUsers: number
  enableComments: boolean
  enableRatings: boolean
  enableNotifications: boolean
  theme: string
  logoUrl: string
  faviconUrl: string
  timezone: string
  version: string
  uptime: string
  lastBackup: string
}

interface SettingsContextType {
  settings: SystemSettings | null
  isLoading: boolean
  error: string | null
  refreshSettings: () => Promise<void>
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<{ success: boolean; error?: string }>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<SystemSettings | null>({
    siteName: 'Filmxane',
    siteDescription: 'Kurdish Video Platform',
    maintenanceMode: false,
    allowRegistrations: true,
    contactEmail: 'admin@filmxane.com',
    maxUsers: 1000,
    enableComments: true,
    enableRatings: true,
    enableNotifications: true,
    theme: 'light',
    logoUrl: '',
    faviconUrl: '',
    timezone: 'UTC',
    version: '1.0.0',
    uptime: 'Unknown',
    lastBackup: 'Never'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://filmxane-backend.onrender.com/api'

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        setIsLoading(false)
        return
      }

      // Load system info and general settings with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      // For now, just use default settings since backend doesn't have settings endpoints
      // TODO: Implement settings endpoints in backend
      console.log('Using default settings - backend settings endpoints not implemented yet')
      setSettings({
        siteName: 'Filmxane',
        siteDescription: 'Kurdish Video Platform',
        maintenanceMode: false,
        allowRegistrations: true,
        contactEmail: 'admin@filmxane.com',
        maxUsers: 1000,
        enableComments: true,
        enableRatings: true,
        enableNotifications: true,
        theme: 'light',
        logoUrl: '',
        faviconUrl: '',
        timezone: 'UTC',
        version: '1.0.0',
        uptime: 'Unknown',
        lastBackup: 'Never'
      })
    } catch (err) {
      console.error('Error in loadSettings:', err)
      // Don't set error state, just use defaults
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time settings update function
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      // For now, just update local settings since backend doesn't have settings endpoints
      // TODO: Implement settings endpoints in backend
      setSettings(prev => prev ? { ...prev, ...newSettings } : null)
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  }

  const refreshSettings = async () => {
    await loadSettings()
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const value: SettingsContextType = {
    settings,
    isLoading,
    error,
    refreshSettings,
    updateSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}
