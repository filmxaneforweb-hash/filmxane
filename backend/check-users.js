const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Connect to database
const db = new sqlite3.Database(dbPath);

// Check all users
db.all('SELECT * FROM users', (err, rows) => {
  if (err) {
    console.error('❌ Error checking users:', err);
  } else {
    console.log('👥 All users in database:');
    console.log('📊 Total users:', rows.length);
    console.log('');
    
    if (rows.length === 0) {
      console.log('❌ No users found in database!');
    } else {
      rows.forEach((user, index) => {
        console.log(`${index + 1}. User:`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Name: ${user.firstName} ${user.lastName}`);
        console.log(`   🔑 Role: ${user.role}`);
        console.log(`   ✅ Status: ${user.status}`);
        console.log('   ─────────────────────');
      });
    }
  }
  db.close();
});
