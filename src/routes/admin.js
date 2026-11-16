const express=require('express'); const router=express.Router();
const {auth,adminOnly}=require('../auth'); const db=require('../db');
router.use(auth,adminOnly);
router.get('/stats',(req,res)=>{
  db.get('SELECT COUNT(*) as users, (SELECT COUNT(*) FROM orders) as orders, (SELECT COALESCE(SUM(amount),0) FROM orders) as revenue FROM users', (e,row)=>res.json(row));
});
router.post('/packages',(req,res)=>{
  const {network,name,data_size,price,wholesale_cost,validity}=req.body;
  db.run('INSERT INTO packages (network,name,data_size,price,wholesale_cost,validity) VALUES (?,?,?,?,?,?)',[network,name,data_size,price,wholesale_cost,validity],function(){res.json({id:this.lastID});});
});
router.put('/packages/:id',(req,res)=>{
  const {price,wholesale_cost,active}=req.body;
  db.run('UPDATE packages SET price=COALESCE(?,price), wholesale_cost=COALESCE(?,wholesale_cost), active=COALESCE(?,active) WHERE id=?',[price,wholesale_cost,active,req.params.id],()=>res.json({ok:true}));
});
router.get('/orders',(req,res)=>{ db.all('SELECT o.*, u.name, u.phone FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC LIMIT 100',(e,rows)=>res.json(rows)); });
router.put('/orders/:id',(req,res)=>{
  const {status}=req.body;
  db.run('UPDATE orders SET status=? WHERE id=?',[status,req.params.id],()=>res.json({ok:true}));
});
module.exports=router;
