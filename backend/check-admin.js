const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Check admin user
function checkAdminUser() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Checking admin user in database...');
  
  db.all("SELECT id, email, firstName, lastName, role, status FROM users WHERE role = 'admin'", (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return;
    }

    if (rows.length === 0) {
      console.log('❌ No admin users found in database');
      console.log('📝 Creating new admin user...');
      createNewAdminUser(db);
    } else {
      console.log('✅ Admin users found:', rows.length);
      rows.forEach((user, index) => {
        console.log(`👤 Admin ${index + 1}:`, {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status
        });
      });
    }
    
    db.close();
  });
}

// Create new admin user
function createNewAdminUser(db) {
  const bcrypt = require('bcryptjs');
  const { v4: uuidv4 } = require('uuid');
  
  const adminUser = {
    id: uuidv4(),
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@filmxane.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Hash password
  bcrypt.hash(adminUser.password, 10).then(hashedPassword => {
    const stmt = db.prepare(`
      INSERT INTO users (id, firstName, lastName, email, password, role, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run([
      adminUser.id,
      adminUser.firstName,
      adminUser.lastName,
      adminUser.email,
      hashedPassword,
      adminUser.role,
      adminUser.status,
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
  }).catch(error => {
    console.error('❌ Error hashing password:', error);
  });
}

// Run the script
checkAdminUser();
