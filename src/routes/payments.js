const express=require('express'); const router=express.Router();
const {auth}=require('../auth'); const db=require('../db');
const axios=require('axios');
// 1) Initialize Paystack payment for wallet top-up
router.post('/topup/init',auth,async(req,res)=>{
  const {amount,email}=req.body; // amount in GHS
  if(!amount||amount<1) return res.status(400).json({error:'Amount must be at least GHS 1'});
  // If no Paystack key yet, return mock link for testing frontend
  if(!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.includes('xxxx')){
    return res.json({mock:true, authorization_url:`/mock-pay?amount=${amount}&ref=MOCK-${Date.now()}`, reference:`MOCK-${Date.now()}`});
  }
  try{
    const r=await axios.post('https://api.paystack.co/transaction/initialize',{amount:amount*100,email:email||'customer@kofiincnetwork.com',callback_url:`${process.env.FRONTEND_URL}/wallet`},{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
    res.json(r.data.data);
  }catch(e){ res.status(500).json({error:'Paystack init failed', detail:e.response?.data}); }
});
// 2) Verify Paystack payment -> credit wallet (call this from frontend after payment, or via webhook)
router.get('/verify/:reference',auth,async(req,res)=>{
  const {reference}=req.params;
  if(reference.startsWith('MOCK-')){
    const amount = 50; // in real flow, get from DB / Paystack verify
    db.run('UPDATE wallets SET balance=balance+? WHERE user_id=?',[amount,req.user.id]);
    return res.json({mock:true,message:`Mock credited GHS ${amount}`});
  }
  try{
    const r=await axios.get(`https://api.paystack.co/transaction/verify/${reference}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
    if(r.data.data.status==='success'){
      const amount=r.data.data.amount/100;
      db.run('UPDATE wallets SET balance=balance+? WHERE user_id=?',[amount,req.user.id]);
      db.run('INSERT INTO transactions (user_id,type,amount,reference,status) VALUES (?,?,?,?,?)',[req.user.id,'topup',amount,reference,'success']);
      return res.json({success:true,amount});
    }
    res.json({success:false});
  }catch(e){ res.status(500).json({error:'Verify failed'}); }
});
module.exports=router;
