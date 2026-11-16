const express=require('express'); const router=express.Router();
const bcrypt=require('bcryptjs'); const jwt=require('jsonwebtoken'); const db=require('../db');
router.post('/register',(req,res)=>{
  const {name,phone,email,password}=req.body;
  if(!name||!phone||!password) return res.status(400).json({error:'name, phone, password required'});
  const hash=bcrypt.hashSync(password,10);
  db.run('INSERT INTO users (name,phone,email,password) VALUES (?,?,?,?)',[name,phone,email||null,hash],function(err){
    if(err) return res.status(400).json({error:'Phone or email already exists'});
    db.run('INSERT INTO wallets (user_id) VALUES (?)',[this.lastID]);
    const token=jwt.sign({id:this.lastID,role:'user'},process.env.JWT_SECRET||'dev-secret',{expiresIn:'7d'});
    res.json({token,user:{id:this.lastID,name,phone,email}});
  });
});
router.post('/login',(req,res)=>{
  const {phone,email,password}=req.body;
  db.get('SELECT * FROM users WHERE phone=? OR email=?',[phone||'',email||''],(err,u)=>{
    if(!u) return res.status(400).json({error:'User not found'});
    if(!bcrypt.compareSync(password,u.password)) return res.status(400).json({error:'Wrong password'});
    const token=jwt.sign({id:u.id,role:u.role},process.env.JWT_SECRET||'dev-secret',{expiresIn:'7d'});
    res.json({token,user:{id:u.id,name:u.name,phone:u.phone,email:u.email,role:u.role}});
  });
});
module.exports=router;
