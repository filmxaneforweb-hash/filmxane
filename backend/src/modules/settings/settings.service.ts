import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Settings } from './settings.entity'

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>
  ) {}

  async getSetting(key: string): Promise<string | null> {
    const setting = await this.settingsRepository.findOne({ where: { key, isActive: true } })
    return setting ? setting.value : null
  }

  async setSetting(key: string, value: string, type: 'string' | 'number' | 'boolean' | 'json' = 'string', description?: string): Promise<Settings> {
    let existingSetting = await this.settingsRepository.findOne({ where: { key } })
    
    if (existingSetting) {
      existingSetting.value = value
      existingSetting.type = type
      if (description) existingSetting.description = description
      return await this.settingsRepository.save(existingSetting)
    } else {
      const newSetting = this.settingsRepository.create({
        key,
        value,
        type,
        description
      })
      return await this.settingsRepository.save(newSetting)
    }
  }

  async getAllSettings(): Promise<Settings[]> {
    return await this.settingsRepository.find({ where: { isActive: true } })
  }

  async getSystemInfo() {
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    return {
      currentTime: new Date().toLocaleTimeString('tr-TR'),
      currentDate: new Date().toLocaleDateString('tr-TR'),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      uptime: `${hours}h ${minutes}m ${seconds}s`,
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString('tr-TR') // Mock last backup
    }
  }

  async getGeneralSettings() {
    const siteName = await this.getSetting('site_name') || 'Filmxane'
    const siteDescription = await this.getSetting('site_description') || 'Kurdish Video Platform'
    const maintenanceMode = await this.getSetting('maintenance_mode') === 'true'
    const allowRegistrations = await this.getSetting('allow_registrations') !== 'false'
    const contactEmail = await this.getSetting('contact_email') || 'admin@filmxane.com'
    const maxUsers = parseInt(await this.getSetting('max_users') || '1000')
    const enableComments = await this.getSetting('enable_comments') !== 'false'
    const enableRatings = await this.getSetting('enable_ratings') !== 'false'
    const enableNotifications = await this.getSetting('enable_notifications') !== 'false'
    const theme = await this.getSetting('theme') || 'light'
    const logoUrl = await this.getSetting('logo_url') || ''
    const faviconUrl = await this.getSetting('favicon_url') || ''

    return {
      siteName,
      siteDescription,
      maintenanceMode,
      allowRegistrations,
      contactEmail,
      maxUsers,
      enableComments,
      enableRatings,
      enableNotifications,
      theme,
      logoUrl,
      faviconUrl
    }
  }

  async updateGeneralSettings(data: {
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
  }) {
    await this.setSetting('site_name', data.siteName, 'string', 'Site name')
    await this.setSetting('site_description', data.siteDescription, 'string', 'Site description')
    await this.setSetting('maintenance_mode', data.maintenanceMode.toString(), 'boolean', 'Maintenance mode')
    await this.setSetting('allow_registrations', data.allowRegistrations.toString(), 'boolean', 'Allow user registrations')
    await this.setSetting('contact_email', data.contactEmail, 'string', 'Contact email')
    await this.setSetting('max_users', data.maxUsers.toString(), 'number', 'Maximum users')
    await this.setSetting('enable_comments', data.enableComments.toString(), 'boolean', 'Enable comments')
    await this.setSetting('enable_ratings', data.enableRatings.toString(), 'boolean', 'Enable ratings')
    await this.setSetting('enable_notifications', data.enableNotifications.toString(), 'boolean', 'Enable notifications')
    await this.setSetting('theme', data.theme, 'string', 'Site theme')
    await this.setSetting('logo_url', data.logoUrl, 'string', 'Logo URL')
    await this.setSetting('favicon_url', data.faviconUrl, 'string', 'Favicon URL')

    return { success: true, message: 'Settings updated successfully' }
  }

}
