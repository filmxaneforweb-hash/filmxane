const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Make user admin
function makeUserAdmin() {
  const db = new sqlite3.Database(dbPath);
  
  console.log('🔍 Making admin@filmxane.com an admin...');
  
  // First check current status
  db.get("SELECT id, email, firstName, lastName, role, status FROM users WHERE email = 'admin@filmxane.com'", (err, row) => {
    if (err) {
      console.error('❌ Database error:', err);
      return;
    }

    if (!row) {
      console.log('❌ User admin@filmxane.com not found');
      db.close();
      return;
    }

    console.log('👤 Current user status:', {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      role: row.role,
      status: row.status
    });

    if (row.role === 'admin') {
      console.log('✅ User is already admin');
      db.close();
      return;
    }

    // Update role to admin
    const stmt = db.prepare("UPDATE users SET role = 'admin' WHERE email = 'admin@filmxane.com'");
    
    stmt.run(function(err) {
      if (err) {
        console.error('❌ Error updating user role:', err);
      } else {
        console.log('✅ User role updated to admin successfully!');
        console.log('📧 Email: admin@filmxane.com');
        console.log('👤 New Role: admin');
        console.log('🆔 Rows affected:', this.changes);
      }
      stmt.finalize();
      
      // Verify the change
      db.get("SELECT id, email, firstName, lastName, role, status FROM users WHERE email = 'admin@filmxane.com'", (err, updatedRow) => {
        if (err) {
          console.error('❌ Error verifying update:', err);
        } else {
          console.log('✅ Verification - Updated user status:', {
            id: updatedRow.id,
            email: updatedRow.email,
            firstName: updatedRow.firstName,
            lastName: updatedRow.lastName,
            role: updatedRow.role,
            status: updatedRow.status
          });
        }
        db.close();
      });
    });
  });
}

// Run the script
makeUserAdmin();
