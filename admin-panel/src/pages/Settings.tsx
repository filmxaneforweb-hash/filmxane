import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Clock, 
  Globe, 
  Database, 
  Shield, 
  Palette,
  Bell,
  User,
  Save,
  RefreshCw
} from 'lucide-react'
import { useWebSocket } from '../hooks/useWebSocket'

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistrations: boolean
  maxUploadSize: string
  supportedVideoFormats: string[]
  supportedImageFormats: string[]
  defaultLanguage: string
  timezone: string
  version: string
  serverTime: string
  uptime: string
  lastBackup: string
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    loadSettings()
    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timeInterval)
  }, [])

  const handleWebSocketMessage = (message: { type: string; data: any }) => {
    switch (message.type) {
      case 'settingsUpdated':
        // Gava mîhengên nû bûn
        setSettings(message.data);
        // Peyama serkeftiyê nîşan bide
        alert('Mîhengên bi WebSocket ve bi serkeftî hatine nûkirin!');
        break;
        
      case 'systemInfoUpdated':
        // Gava agahiyên sîstemê nû bûn
        loadSettings();
        break;
    }
  };

  useWebSocket(handleWebSocketMessage);

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`)
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Mîhengên nehatin barkirin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings) return
    
    setIsSaving(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })
      
      if (response.ok) {
        // Peyama serkeftiyê nîşan bide
        alert('Mîhengên bi serkeftî hatine tomarkirin!')
        // WebSocket üzerinden güncelleme gelecek
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const formatUptime = (uptime: string) => {
    // Convert uptime string to readable format
    return uptime || 'Calculating...'
  }

  const formatLastBackup = (lastBackup: string) => {
    if (!lastBackup) return 'Never'
    const date = new Date(lastBackup)
    return date.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage Filmxane system configuration and preferences
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50"
        >
          {isSaving ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </motion.button>
      </motion.div>

      {/* Time Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Time</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Server time</p>
            </div>
          </div>
          <div className="text-2xl font-mono text-gray-900 dark:text-white">
            {currentTime.toLocaleTimeString()}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {currentTime.toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Timezone</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Server timezone</p>
            </div>
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {settings?.timezone || 'Loading...'}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {settings?.timezone ? `Server timezone: ${settings.timezone}` : 'Loading timezone...'}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Uptime</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Server running time</p>
            </div>
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            {formatUptime(settings?.uptime || '')}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last backup: {formatLastBackup(settings?.lastBackup || '')}
          </p>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings?.siteName || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, siteName: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Description
              </label>
              <textarea
                value={settings?.siteDescription || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, siteDescription: e.target.value } : null)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings?.maintenanceMode || false}
                onChange={(e) => setSettings(prev => prev ? { ...prev, maintenanceMode: e.target.checked } : null)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Maintenance Mode</span>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings?.allowRegistrations || false}
                onChange={(e) => setSettings(prev => prev ? { ...prev, allowRegistrations: e.target.checked } : null)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Allow User Registrations</span>
            </div>
          </div>
        </motion.div>

        {/* File Settings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">File Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Upload Size
              </label>
              <input
                type="text"
                value={settings?.maxUploadSize || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, maxUploadSize: e.target.value } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supported Video Formats
              </label>
              <input
                type="text"
                value={settings?.supportedVideoFormats?.join(', ') || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, supportedVideoFormats: e.target.value.split(', ').filter(Boolean) } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="MP4, AVI, MOV, MKV"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Supported Image Formats
              </label>
              <input
                type="text"
                value={settings?.supportedImageFormats?.join(', ') || ''}
                onChange={(e) => setSettings(prev => prev ? { ...prev, supportedImageFormats: e.target.value.split(', ').filter(Boolean) } : null)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="JPG, PNG, GIF"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">System Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{settings?.version || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Default Language</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{settings?.defaultLanguage || 'Loading...'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Server Time</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Settings
