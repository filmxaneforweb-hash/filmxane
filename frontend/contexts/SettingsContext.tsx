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

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api'

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load system info and general settings
      const [systemInfoRes, generalRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/settings/system-info`),
        fetch(`${API_BASE_URL}/admin/settings/general`)
      ])

      if (systemInfoRes.ok && generalRes.ok) {
        const systemInfo = await systemInfoRes.json()
        const generalSettings = await generalRes.json()

        const mergedSettings: SystemSettings = {
          ...generalSettings,
          timezone: systemInfo.timezone || 'UTC',
          version: systemInfo.version || '1.0.0',
          uptime: systemInfo.uptime || 'Unknown',
          lastBackup: systemInfo.lastBackup || 'Never'
        }

        setSettings(mergedSettings)
      } else {
        throw new Error('Failed to load settings')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings')
      console.error('Error loading settings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Real-time settings update function
  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings/general`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('filmxane_admin_token')}`
        },
        body: JSON.stringify(newSettings)
      })

      if (response.ok) {
        // Update local settings immediately
        setSettings(prev => prev ? { ...prev, ...newSettings } : null)
        return { success: true }
      } else {
        throw new Error('Failed to update settings')
      }
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
