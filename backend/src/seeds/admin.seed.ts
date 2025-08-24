import { DataSource } from 'typeorm';
import { User, UserRole, UserStatus } from '../entities/user.entity';

// Basit hash fonksiyonu (bcrypt yerine)
const simpleHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

export const createAdminUser = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  // Admin kullanıcısı var mı kontrol et
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@filmxane.com' }
  });

  if (existingAdmin) {
    console.log('✅ Admin kullanıcısı zaten mevcut');
    return existingAdmin;
  }

  // Admin kullanıcısı oluştur
  const adminUser = new User();
  adminUser.firstName = 'Admin';
  adminUser.lastName = 'User';
  adminUser.email = 'admin@filmxane.com';
  adminUser.password = simpleHash('admin123');
  adminUser.role = UserRole.ADMIN;
  adminUser.status = UserStatus.ACTIVE;
  adminUser.emailVerified = true;
  adminUser.createdAt = new Date();
  adminUser.updatedAt = new Date();

  const savedAdmin = await userRepository.save(adminUser);
  console.log('✅ Admin kullanıcısı oluşturuldu:', savedAdmin.email);
  
  return savedAdmin;
};
