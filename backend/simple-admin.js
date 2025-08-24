const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'filmxane.db');
const db = new sqlite3.Database(dbPath);

// Make user admin
db.run(`UPDATE users SET role = 'admin' WHERE email = 'admin@filmxane.com'`, function(err) {
  if (err) {
    console.error('❌ Error:', err);
  } else {
    console.log(`✅ Updated ${this.changes} user(s) to admin`);
  }
  db.close();
});
