const express=require('express'); const router=express.Router();
const {auth}=require('../auth'); const db=require('../db');
router.get('/',auth,(req,res)=>{
  db.get('SELECT * FROM wallets WHERE user_id=?',[req.user.id],(e,w)=>res.json(w||{balance:0,earnings:0}));
});
router.post('/move-earnings',auth,(req,res)=>{
  const {amount}=req.body;
  db.get('SELECT * FROM wallets WHERE user_id=?',[req.user.id],(e,w)=>{
    if(!w||w.earnings < amount) return res.status(400).json({error:'Not enough earnings'});
    db.run('UPDATE wallets SET earnings=earnings-?, balance=balance+? WHERE user_id=?',[amount,amount,req.user.id]);
    res.json({message:`Moved GHS ${amount} from earnings to wallet`});
  });
});
module.exports=router;
