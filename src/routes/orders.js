const express=require('express'); const router=express.Router();
const {auth}=require('../auth'); const db=require('../db');
// Create order: deduct wallet, call supplier (mocked here, plug real API in supplier.js)
router.post('/',auth,(req,res)=>{
  const {package_id,beneficiary}=req.body;
  if(!/^(0|\+233)\d{9}$/.test(beneficiary||'')) return res.status(400).json({error:'Enter valid Ghana number e.g. 0241234567'});
  db.get('SELECT * FROM packages WHERE id=?',[package_id],(e,pkg)=>{
    if(!pkg) return res.status(404).json({error:'Package not found'});
    db.get('SELECT * FROM wallets WHERE user_id=?',[req.user.id],(e,w)=>{
      if(!w||w.balance < pkg.price) return res.status(400).json({error:'Insufficient wallet balance. Top up first.'});
      const orderId = 'KIN'+Date.now().toString().slice(-8);
      const profit = pkg.price - pkg.wholesale_cost;
      db.run('UPDATE wallets SET balance=balance-?, earnings=earnings+? WHERE user_id=?',[pkg.price,profit,req.user.id]);
      // TODO: Replace with real supplier call: await axios.post(DATA_SUPPLIER_API_URL, ...)
      // For now simulate delivery after 5s in real life supplier would return ref
      db.run('INSERT INTO orders (id,user_id,package_id,beneficiary,amount,status,supplier_ref) VALUES (?,?,?,?,?,?,?)',[orderId,req.user.id,package_id,beneficiary,pkg.price,'processing','SUP-'+orderId]);
      db.run('INSERT INTO transactions (user_id,type,amount,reference,status) VALUES (?,?,?,?,?)',[req.user.id,'purchase',pkg.price,orderId,'success']);
      res.json({orderId,status:'processing',message:'Order received. Data will be delivered shortly.',amount:pkg.price});
    });
  });
});
router.get('/',auth,(req,res)=>{
  db.all('SELECT o.*, p.name as package_name, p.network FROM orders o JOIN packages p ON p.id=o.package_id WHERE o.user_id=? ORDER BY o.created_at DESC',[req.user.id],(e,rows)=>res.json(rows));
});
router.get('/track/:id',(req,res)=>{
  db.get('SELECT o.*, p.name as package_name FROM orders o JOIN packages p ON p.id=o.package_id WHERE o.id=?',[req.params.id],(e,row)=>{
    if(!row) return res.status(404).json({error:'Order not found'});
    res.json(row);
  });
});
module.exports=router;
