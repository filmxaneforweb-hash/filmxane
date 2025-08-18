import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { SettingsService } from './settings.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '../../entities/user.entity'

@Controller('admin/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('system-info')
  getSystemInfo() {
    return this.settingsService.getSystemInfo()
  }

  @Get('general')
  getGeneralSettings() {
    return this.settingsService.getGeneralSettings()
  }

  @Post('general')
  updateGeneralSettings(@Body() data: {
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
    return this.settingsService.updateGeneralSettings(data)
  }

  @Get('maintenance-status')
  getMaintenanceStatus() {
    return this.settingsService.getSetting('maintenance_mode')
  }
}
