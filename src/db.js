const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '..', 'kofi.db'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone TEXT UNIQUE, email TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS wallets (user_id INTEGER PRIMARY KEY, balance REAL DEFAULT 0, earnings REAL DEFAULT 0, FOREIGN KEY(user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS packages (id INTEGER PRIMARY KEY AUTOINCREMENT, network TEXT, name TEXT, data_size TEXT, price REAL, wholesale_cost REAL, validity TEXT, active INTEGER DEFAULT 1)`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, user_id INTEGER, package_id INTEGER, beneficiary TEXT, amount REAL, status TEXT DEFAULT 'processing', supplier_ref TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS transactions (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, type TEXT, amount REAL, reference TEXT, status TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});
module.exports = db;
