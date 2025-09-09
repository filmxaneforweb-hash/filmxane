const { createConnection } = require('typeorm');
const bcrypt = require('bcryptjs');
const { User } = require('./dist/entities/user.entity');

async function createRenderAdmin() {
  try {
    // Render PostgreSQL bağlantısı
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://filmxane_user:your_password@dpg-xxxxx-a.oregon-postgres.render.com/filmxane_db',
      entities: [User],
      synchronize: false,
      logging: true
    });

    console.log('Database bağlantısı başarılı!');

    // Admin kullanıcısını kontrol et
    const existingAdmin = await connection.getRepository(User).findOne({
      where: { email: 'sekolikeyamal@gmail.com' }
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut!');
      
      // Admin rolünü güncelle
      existingAdmin.role = 'admin';
      existingAdmin.isAdmin = true;
      await connection.getRepository(User).save(existingAdmin);
      console.log('Admin rolü güncellendi!');
    } else {
      // Yeni admin kullanıcısı oluştur
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const adminUser = connection.getRepository(User).create({
        email: 'sekolikeyamal@gmail.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isAdmin: true,
        isActive: true,
        emailVerified: true
      });

      await connection.getRepository(User).save(adminUser);
      console.log('Admin kullanıcısı oluşturuldu!');
    }

    await connection.close();
    console.log('İşlem tamamlandı!');
    
  } catch (error) {
    console.error('Hata:', error);
  }
}

createRenderAdmin();
