const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Create admin user
async function createAdminUser() {
  const db = new sqlite3.Database(dbPath);
  
  try {
    // Admin user data
    const adminUser = {
      id: uuidv4(),
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@filmxane.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(adminUser.password, 10);

    // Check if user already exists
    db.get("SELECT id FROM users WHERE email = ?", [adminUser.email], (err, row) => {
      if (err) {
        console.error('❌ Database error:', err);
        return;
      }

      if (row) {
        console.log('✅ Admin user already exists');
        console.log('📧 Email:', adminUser.email);
        console.log('🔑 Password:', adminUser.password);
        console.log('👤 Role:', adminUser.role);
        return;
      }

      // Insert admin user
      const stmt = db.prepare(`
        INSERT INTO users (id, firstName, lastName, email, password, role, isActive, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run([
        adminUser.id,
        adminUser.firstName,
        adminUser.lastName,
        adminUser.email,
        hashedPassword,
        adminUser.role,
        adminUser.isActive ? 1 : 0,
        adminUser.createdAt,
        adminUser.updatedAt
      ], function(err) {
        if (err) {
          console.error('❌ Error creating admin user:', err);
        } else {
          console.log('✅ Admin user created successfully!');
          console.log('📧 Email:', adminUser.email);
          console.log('🔑 Password:', adminUser.password);
          console.log('👤 Role:', adminUser.role);
          console.log('🆔 User ID:', this.lastID);
        }
        stmt.finalize();
      });
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Close database connection after a delay
    setTimeout(() => {
      db.close();
      console.log('🔒 Database connection closed');
    }, 1000);
  }
}

// Run the script
console.log('🚀 Creating admin user...');
createAdminUser();
