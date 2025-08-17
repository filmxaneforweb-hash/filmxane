'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Bell, Eye, Globe, Palette, Volume2, Subtitles, Save, X } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth()
  
  // Form states
  const [accountSettings, setAccountSettings] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newReleases: true,
    recommendations: false,
    marketing: false
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    watchHistory: 'private',
    favorites: 'public',
    recommendations: 'public'
  })

  const [generalSettings, setGeneralSettings] = useState({
    language: 'ku',
    theme: 'dark',
    autoplay: true,
    subtitles: 'ku'
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Load user settings from backend
  useEffect(() => {
    const loadUserSettings = async () => {
      if (!isAuthenticated) return
      
      try {
        setLoading(true)
        const response = await apiClient.getUserSettings()
        
        if (response.success && response.data) {
          setAccountSettings(prev => ({
            ...prev,
            name: response.data.name || user?.name || '',
            email: response.data.email || user?.email || ''
          }))
          
          if (response.data.notifications) {
            setNotificationSettings(response.data.notifications)
          }
          
          if (response.data.privacy) {
            setPrivacySettings(response.data.privacy)
          }
          
          if (response.data.general) {
            setGeneralSettings(response.data.general)
          }
        }
      } catch (error) {
        console.error('Failed to load user settings:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserSettings()
  }, [isAuthenticated, user])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 text-white text-center py-16">
        <div className="animate-spin w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h3 className="text-2xl font-bold text-slate-400 mb-4">Mîhengên yên barkirin</h3>
        <p className="text-slate-500">Ji kerema xwe pêşniyareke din lêbigere</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 text-white text-center py-16">
        <h3 className="text-2xl font-bold text-slate-400 mb-4">Ji bo dîtina mîhengên te têkeve</h3>
        <p className="text-slate-500">Ji kerema xwe <a href="/login" className="underline">têkeve</a> da ku mîhengên te yên şexsî bibînî.</p>
      </main>
    )
  }

  // Handle form changes
  const handleAccountChange = (field: string, value: string) => {
    setAccountSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }))
  }

  const handlePrivacyChange = (field: string, value: string) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }))
  }

  const handleGeneralChange = (field: string, value: string | boolean) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submissions
  const handleAccountSave = async () => {
    if (!isAuthenticated) return
    
    try {
      setSaving(true)
      const response = await apiClient.updateUserSettings({
        name: accountSettings.name,
        email: accountSettings.email
      })
      
      if (response.success) {
        alert('Mîhengên hesabê bi serkeftî hatin tomarkirin!')
      } else {
        alert('Hata: ' + response.message)
      }
    } catch (error) {
      console.error('Failed to save account settings:', error)
      alert('Hata: Mîhengên nehatin tomarkirin')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!isAuthenticated) return
    
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      alert('Şîfreyên nû ne yek in!')
      return
    }
    if (accountSettings.newPassword.length < 6) {
      alert('Şîfreya nû divê bi kêmî 6 tîpan be!')
      return
    }
    
    try {
      setSaving(true)
      const response = await apiClient.changePassword({
        currentPassword: accountSettings.currentPassword,
        newPassword: accountSettings.newPassword
      })
      
      if (response.success) {
        alert('Şîfre bi serkeftî hate guhertin!')
        
        // Clear password fields
        setAccountSettings(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        alert('Hata: ' + response.message)
      }
    } catch (error) {
      console.error('Failed to change password:', error)
      alert('Hata: Şîfre nehat guhertin')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAllSettings = async () => {
    if (!isAuthenticated) return
    
    try {
      setSaving(true)
      const response = await apiClient.updateUserSettings({
        notifications: notificationSettings,
        privacy: privacySettings,
        general: generalSettings
      })
      
      if (response.success) {
        alert('Hemû mîhengên bi serkeftî hatin tomarkirin!')
      } else {
        alert('Hata: ' + response.message)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      alert('Hata: Mîhengên nehatin tomarkirin')
    } finally {
      setSaving(false)
    }
  }

  const handleResetSettings = async () => {
    if (!isAuthenticated) return
    
    if (confirm('Tu dixwazî hemû mîhengên te were reset kirin?')) {
      try {
        setSaving(true)
        const response = await apiClient.resetUserSettings()
        
        if (response.success) {
          // Reset to default values
          setNotificationSettings({
            emailNotifications: true,
            pushNotifications: true,
            newReleases: true,
            recommendations: false,
            marketing: false
          })
          setPrivacySettings({
            profileVisibility: 'public',
            watchHistory: 'private',
            favorites: 'public',
            recommendations: 'public'
          })
          setGeneralSettings({
            language: 'ku',
            theme: 'dark',
            autoplay: true,
            subtitles: 'ku'
          })
          
          alert('Mîhengên bi serkeftî hatin reset kirin!')
        } else {
          alert('Hata: ' + response.message)
        }
      } catch (error) {
        console.error('Failed to reset settings:', error)
        alert('Hata: Mîhengên nehatin reset kirin')
      } finally {
        setSaving(false)
      }
    }
  }

  const handleExportData = async () => {
    if (!isAuthenticated) return
    
    try {
      setSaving(true)
      const response = await apiClient.exportUserData()
      
      if (response.success && response.data) {
        // Create and download file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'filmxane-user-data.json'
        a.click()
        window.URL.revokeObjectURL(url)
        
        alert('Daneyên te bi serkeftî hatin daxistin!')
      } else {
        alert('Hata: ' + response.message)
      }
    } catch (error) {
      console.error('Failed to export user data:', error)
      alert('Hata: Daneyên nehatin daxistin')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!isAuthenticated) return
    
    if (confirm('Tu dixwazî hesaba te were jêbirin? Ev çalakî nayê vegerandin!')) {
      try {
        setSaving(true)
        const response = await apiClient.deleteUserAccount()
        
        if (response.success) {
          alert('Hesaba te bi serkeftî hate jêbirin!')
          // Redirect to home page
          window.location.href = '/'
        } else {
          alert('Hata: ' + response.message)
        }
      } catch (error) {
        console.error('Failed to delete account:', error)
        alert('Hata: Hesaba nehat jêbirin')
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20">
      {/* Hero Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Mîhengên
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-slate-400 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Hesaba xwe û mîhengên te yên şexsî yên xweşbînî bike
          </motion.p>
        </div>
      </section>

      {/* Settings Sections */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Account Settings */}
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mîhengên Hesabê</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Nav</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={accountSettings.name}
                    onChange={(e) => handleAccountChange('name', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Navê te"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={accountSettings.email}
                    onChange={(e) => handleAccountChange('email', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emaila te"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Şîfreya Niha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={accountSettings.currentPassword}
                    onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şîfreya niha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Şîfreya Nû</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={accountSettings.newPassword}
                    onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şîfreya nû"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Şîfreya Nû Bidî</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={accountSettings.confirmPassword}
                    onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Şîfreya nû bidî"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleAccountSave}
                disabled={saving}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Tomarkirin...' : 'Tomarke'}
              </button>
              <button 
                onClick={handlePasswordChange}
                disabled={saving}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {saving ? 'Guhertin...' : 'Şîfre Biguherre'}
              </button>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mîhengên Agahdariyê</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Agahdariyên Email', description: 'Agahdariyên bi email' },
                { key: 'pushNotifications', label: 'Agahdariyên Push', description: 'Agahdariyên li ser cîhaza te' },
                { key: 'newReleases', label: 'Rêzefîlmên Nû', description: 'Agahdariyên ji bo rêzefîlmên nû' },
                { key: 'recommendations', label: 'Pêşniyar', description: 'Pêşniyaren şexsî' },
                { key: 'marketing', label: 'Bazirganî', description: 'Agahdariyên bazirganî' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{setting.label}</h3>
                    <p className="text-slate-400 text-sm">{setting.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(setting.key, !notificationSettings[setting.key as keyof typeof notificationSettings])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      notificationSettings[setting.key as keyof typeof notificationSettings] 
                        ? 'bg-blue-500' 
                        : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        notificationSettings[setting.key as keyof typeof notificationSettings] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mîhengên Tûtî</h2>
            </div>

            <div className="space-y-4">
              {[
                { key: 'profileVisibility', label: 'Diyariya Profîlê', options: ['public', 'private', 'friends'] },
                { key: 'watchHistory', label: 'Dîroka Temaşeyê', options: ['public', 'private', 'friends'] },
                { key: 'favorites', label: 'Favorî', options: ['public', 'private', 'friends'] },
                { key: 'recommendations', label: 'Pêşniyar', options: ['public', 'private', 'friends'] }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{setting.label}</h3>
                  </div>
                  <select
                    value={privacySettings[setting.key as keyof typeof privacySettings]}
                    onChange={(e) => handlePrivacyChange(setting.key, e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="public">Gelal</option>
                    <option value="private">Şexsî</option>
                    <option value="friends">Heval</option>
                  </select>
                </div>
              ))}
            </div>
          </motion.div>

          {/* General Settings */}
          <motion.div 
            className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Mîhengên Giştî</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Ziman</label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => handleGeneralChange('language', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ku">Kurdî</option>
                  <option value="tr">Tirkî</option>
                  <option value="en">Îngilîzî</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Tema</label>
                <select
                  value={generalSettings.theme}
                  onChange={(e) => handleGeneralChange('theme', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="dark">Tarî</option>
                  <option value="light">Ronî</option>
                  <option value="auto">Otomatîk</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Altyazî</label>
                <select
                  value={generalSettings.subtitles}
                  onChange={(e) => handleGeneralChange('subtitles', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="ku">Kurdî</option>
                  <option value="tr">Tirkî</option>
                  <option value="en">Îngilîzî</option>
                  <option value="off">Neçalak</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Otomatîk Temaşe</h3>
                  <p className="text-slate-400 text-sm">Vîdyoya din otomatîk dest pê bike</p>
                </div>
                <button
                  onClick={() => handleGeneralChange('autoplay', !generalSettings.autoplay)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    generalSettings.autoplay ? 'bg-orange-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      generalSettings.autoplay ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button 
                onClick={handleSaveAllSettings}
                disabled={saving}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Tomarkirin...' : 'Hemû Tomarke'}
              </button>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div 
            className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <h2 className="text-2xl font-bold text-red-400 mb-6">Qada Xetarê</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Daneyên Te Daxistin</h3>
                  <p className="text-slate-400 text-sm">Hemû daneyên te yên şexsî daxistin</p>
                </div>
                <button 
                  onClick={handleExportData}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {saving ? 'Daxistin...' : 'Daxistin'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Mîhengên Reset Kirin</h3>
                  <p className="text-slate-400 text-sm">Hemû mîhengên te yên şexsî reset bike</p>
                </div>
                <button 
                  onClick={handleResetSettings}
                  disabled={saving}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {saving ? 'Reset...' : 'Reset'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-900/30 rounded-lg">
                <div>
                  <h3 className="text-white font-medium">Hesaba Te Jêbirin</h3>
                  <p className="text-slate-400 text-sm">Hesaba te û hemû daneyên te yên şexsî jêbirin</p>
                </div>
                <button 
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  {saving ? 'Jêbirin...' : 'Jêbirin'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
