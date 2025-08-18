import { DataSource } from 'typeorm';
import { seedUsers } from './users.seed';
import { seedCategories } from './categories.seed';
import { seedVideos } from './videos.seed';

export const runSeeds = async (dataSource: DataSource) => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Run seeds in order
    await seedUsers(dataSource);
    await seedCategories(dataSource);
    await seedVideos(dataSource);
    
    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};
