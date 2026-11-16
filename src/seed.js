const db = require('./db');
const bcrypt = require('bcryptjs');
const pkgs = [
  ['MTN','MTN 1GB','1GB',4.50,3.80,'No Expiry'],
  ['MTN','MTN 2.5GB','2.5GB',10.50,9.00,'No Expiry'],
  ['MTN','MTN 5GB','5GB',20,17.50,'No Expiry'],
  ['MTN','MTN 10GB','10GB',38,33.00,'No Expiry'],
  ['MTN','MTN 15GB','15GB',55,49.00,'No Expiry'],
  ['MTN','MTN 30GB','30GB',95,85.00,'No Expiry'],
  ['Telecel','Telecel 5GB','5GB',22,19.00,'No Expiry'],
  ['Telecel','Telecel 10GB','10GB',40,35.00,'No Expiry'],
  ['AirtelTigo','AirtelTigo 5GB','5GB',21,18.00,'No Expiry'],
  ['AirtelTigo','AirtelTigo 10GB','10GB',39,34.00,'No Expiry'],
  ['Checker','WAEC Result Checker','1 Pin',35,28.00,'Instant'],
  ['Checker','School Placement Checker','1 Pin',15,11.00,'Instant'],
];
db.serialize(()=>{
  const stmt = db.prepare('INSERT OR IGNORE INTO packages (network,name,data_size,price,wholesale_cost,validity) VALUES (?,?,?,?,?,?)');
  pkgs.forEach(p=>stmt.run(p));
  stmt.finalize();
  const hash = bcrypt.hashSync('admin123',10);
  db.run(`INSERT OR IGNORE INTO users (name,phone,email,password,role) VALUES (?,?,?,?,?)`, ['Evans','0240000000','evans@kofiincnetwork.com',hash,'admin'], function(){
    const id = this.lastID || 1;
    db.run(`INSERT OR IGNORE INTO wallets (user_id,balance,earnings) VALUES (?,?,?)`,[id,0,0]);
    console.log('Seeded KOFI INC NETWORK. Admin: evans@kofiincnetwork.com / admin123');
  });
});
