import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedVideos } from './videos.seed';
import { createAdminUser } from './admin.seed';

export const runSeeds = async (dataSource: DataSource) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Seed'leri aktif et
    await seedUsers(dataSource);
    await createAdminUser(dataSource);
    await seedCategories(dataSource);
    await seedVideos(dataSource);
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};
