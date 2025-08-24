const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// List all users
function listAllUsers() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Listing all users in database...');
  
  db.all("SELECT id, email, firstName, lastName, role, status, createdAt FROM users ORDER BY createdAt DESC", (err, rows) => {
    if (err) {
      console.error('❌ Database error:', err);
      return;
    }

    if (rows.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${rows.length} users:`);
      rows.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`, {
          id: user.id.substring(0, 8) + '...',
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          createdAt: user.createdAt
        });
      });
    }
    
    db.close();
  });
}

// Run the script
listAllUsers();
