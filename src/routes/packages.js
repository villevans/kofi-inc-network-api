const express=require('express'); const router=express.Router();
const db=require('../db');
router.get('/',(req,res)=>{
  const {network}=req.query;
  const sql = network ? 'SELECT * FROM packages WHERE active=1 AND network=?' : 'SELECT * FROM packages WHERE active=1';
  const params = network ? [network] : [];
  db.all(sql,params,(e,rows)=>res.json(rows));
});
module.exports=router;
