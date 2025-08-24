import { DataSource } from 'typeorm';
// import { seedUsers } from './users.seed';
// import { seedCategories } from './categories.seed';
// import { seedVideos } from './videos.seed';
// import { createAdminUser } from './admin.seed';

export const runSeeds = async (dataSource: DataSource) => {
  try {
    console.log('🌱 Database seeding disabled - using real data only');
    
    // Seed'ler devre dışı - gerçek veri kullanılıyor
    // await seedUsers(dataSource);
    // await createAdminUser(dataSource);
    // await seedCategories(dataSource);
    // await seedVideos(dataSource);
    
    console.log('✅ Real data mode enabled - no mock data');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
};
