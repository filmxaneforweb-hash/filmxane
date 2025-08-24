const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');
console.log('📂 Database path:', dbPath);

// Check if database file exists
const fs = require('fs');
if (!fs.existsSync(dbPath)) {
  console.log('❌ Database file does not exist!');
  process.exit(1);
}

// Connect to database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
  console.log('✅ Connected to database');
});

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('❌ Error checking tables:', err);
    db.close();
    return;
  }
  
  console.log('📋 Available tables:', tables.map(t => t.name).join(', '));
  
  // Check users count
  db.get('SELECT COUNT(*) as count FROM users', (err, result) => {
    if (err) {
      console.error('❌ Error counting users:', err);
    } else {
      console.log('👥 Total users:', result.count);
    }
    
    // Check specific admin user
    db.get('SELECT * FROM users WHERE email = ?', ['admin@filmxane.com'], (err, user) => {
      if (err) {
        console.error('❌ Error finding admin user:', err);
      } else if (user) {
        console.log('✅ Admin user found:');
        console.log('   📧 Email:', user.email);
        console.log('   👤 Name:', user.firstName, user.lastName);
        console.log('   🔑 Role:', user.role);
        console.log('   ✅ Status:', user.status);
      } else {
        console.log('❌ Admin user NOT found');
      }
      
      db.close();
    });
  });
});
