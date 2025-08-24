const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database path
const dbPath = path.join(__dirname, 'filmxane.db');

// Connect to database
const db = new sqlite3.Database(dbPath);

// Check tables
db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('❌ Error checking tables:', err);
  } else {
    console.log('📋 Available tables:');
    rows.forEach(row => {
      console.log(`  - ${row.name}`);
    });
  }
  db.close();
});
