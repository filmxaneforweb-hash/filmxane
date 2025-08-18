import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Shield,
  Bell,
  Globe,
  Database,
  Key,
  Save,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react'

interface SystemSettings {
  siteName: string
  siteDescription: string
  maintenanceMode: boolean
  allowRegistration: boolean
  allowComments: boolean
  maxUploadSize: number
  allowedFileTypes: string[]
  emailNotifications: boolean
  pushNotifications: boolean
  theme: 'light' | 'dark' | 'auto'
}

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Filmxane',
    siteDescription: 'Platforma fîlm û rêzefîlman',
    maintenanceMode: false,
    allowRegistration: true,
    allowComments: true,
    maxUploadSize: 100,
    allowedFileTypes: ['mp4', 'avi', 'mov', 'mkv'],
    emailNotifications: true,
    pushNotifications: true,
    theme: 'auto'
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSettings, setOriginalSettings] = useState<SystemSettings | null>(null)

  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3005/api'

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        console.error('No admin token found')
        return
      }

      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const settingsData = await response.json()
        setSettings(settingsData)
        setOriginalSettings(settingsData)
      } else {
        console.error('Failed to load settings:', response.status)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('filmxane_admin_token')
      if (!token) {
        alert('Ji kerema xwe dîsa têkeve')
        return
      }

      const response = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setOriginalSettings(settings)
        setHasChanges(false)
        alert('Mîhengên bi serkeftî hatine tomarkirin')
      } else {
        const errorData = await response.json()
        alert(`Çewtiyek çêbû: ${errorData.message || 'Failed to save settings'}`)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Çewtiyek çêbû, ji kerema xwe dîsa biceribîne')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings)
      setHasChanges(false)
    }
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6 px-4 lg:px-6 xl:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="bg-gray-200 h-96 rounded-xl"></div>
        </div>
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Mîhengên
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Mîhengên sîstemê û platformê biguherîne
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {hasChanges && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Guhertin hene</span>
            </motion.div>
          )}
          <button
            onClick={handleReset}
            disabled={!hasChanges}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 inline mr-2 animate-spin" />
                Tê tomarkirin...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 inline mr-2" />
                Tomar Bike
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mîhengên Giştî</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Navê Malperê
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Daxûyaniya Malperê
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Moda Tema
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="auto">Otomatîk</option>
                <option value="light">Ronahî</option>
                <option value="dark">Tarî</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mîhengên Sîstemê</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Moda Parastinê</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Malperê ji bikarhêneran veşêre</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Destûra Qeydbûnê</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bikarhêneran destûr bide qeyd bibin</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Destûra Şîroveyan</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Bikarhêneran destûr bide şîrove binivîsin</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowComments}
                  onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Upload Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mîhengên Barkirinê</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mezinahiya Maksîmal a Barkirinê (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cureyên Pelên Destûrdar
              </label>
              <input
                type="text"
                value={settings.allowedFileTypes.join(', ')}
                onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value.split(',').map(t => t.trim()))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="mp4, avi, mov, mkv"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Cureyên pelan bi vîrgulê ji hev cuda bike
              </p>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mîhengên Agahdariyê</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Agahdariyên E-mail</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Agahdariyên bi e-mailê bişîne</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Agahdariyên Push</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Agahdariyên push bişîne</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Settings
