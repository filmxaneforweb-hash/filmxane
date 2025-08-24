const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Connect to database
const db = new sqlite3.Database(dbPath);

// Fix admin roles
const fixAdminRoles = () => {
  const query = `
    UPDATE users 
    SET role = 'admin' 
    WHERE role = 'ADMIN'
  `;
  
  db.run(query, function(err) {
    if (err) {
      console.error('❌ Error fixing admin roles:', err);
    } else {
      console.log(`✅ Fixed ${this.changes} admin role(s) from ADMIN to admin`);
    }
    
    // Verify the fix
    db.all('SELECT email, role FROM users WHERE role = "admin"', (err, rows) => {
      if (err) {
        console.error('❌ Error checking admins:', err);
      } else {
        console.log('👑 Admin users after fix:');
        rows.forEach(user => {
          console.log(`   📧 ${user.email} - Role: ${user.role}`);
        });
      }
      db.close();
    });
  });
};

console.log('🔧 Fixing admin roles from ADMIN to admin...');
fixAdminRoles();
