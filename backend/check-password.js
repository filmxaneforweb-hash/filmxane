const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Check test user password
function checkTestUser() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Checking test user in database...');
  
  db.get("SELECT id, email, firstName, lastName, role, status, password FROM users WHERE email = 'testuser@test.com'", (err, row) => {
    if (err) {
      console.error('❌ Database error:', err);
      return;
    }

    if (!row) {
      console.log('❌ Test user not found');
    } else {
      console.log('✅ Test user found:', {
        id: row.id,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        role: row.role,
        status: row.status,
        passwordHash: row.password ? `Length: ${row.password.length}` : 'MISSING'
      });
      
      // Try to create a new admin user with admin@filmxane.com
      console.log('📝 Creating new admin user with admin@filmxane.com...');
      createNewAdminUser(db);
    }
    
    // Don't close db yet, wait for createNewAdminUser
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
      
      // Now close the database
      db.close();
    });
  }).catch(error => {
    console.error('❌ Error hashing password:', error);
    db.close();
  });
}

// Run the script
checkTestUser();
