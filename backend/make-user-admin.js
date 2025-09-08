const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Make user admin
function makeUserAdmin(email) {
  const db = new sqlite3.Database(dbPath);
  
  console.log(`🔧 Making user ${email} admin...`);
  
  db.run(
    "UPDATE users SET role = 'admin' WHERE email = ?",
    [email],
    function(err) {
      if (err) {
        console.error('❌ Database error:', err);
        return;
      }

      if (this.changes > 0) {
        console.log(`✅ User ${email} is now admin!`);
      } else {
        console.log(`❌ User ${email} not found`);
      }
      
      db.close();
    }
  );
}

// Get email from command line argument or use default
const email = process.argv[2] || 'sekolikelamineyamal@gmail.com';
makeUserAdmin(email);
