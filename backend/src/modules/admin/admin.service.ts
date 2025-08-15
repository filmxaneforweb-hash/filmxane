import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  // TODO: Implement admin logic
  async getDashboardStats() {
    return {
      totalUsers: 0,
      totalVideos: 0,
      totalRevenue: 0,
    };
  }
}
