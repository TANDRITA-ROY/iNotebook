const express =require('express');
const route= express.Router();
const User= require('../model/User')
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JsonAuthSign= "IAmASignature"
const featchUser = require('../middleWire/fatchUser')
// Crreating a user
route.post('/', [
    body('name','Enter a valid name').isLength({ min: 2 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Enter a valid Password, atleast 5 character').isLength({ min: 5 }),
],async (req,res)=> {
  let success= false
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
     }
     try{
     let user= await User.findOne({email:req.body.email})
     if(user)
     {
       return res.status(400).json({success, error:"Sorry! User already exsist."})
     }
     const salt= await bcrypt.genSaltSync(10);
     const secPass= await bcrypt.hashSync(req.body.password, salt)
    users= await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
      })
      const user1={
        user:{
          id:users.id
        }
      }
      var token = jwt.sign(user1, JsonAuthSign);
      success=true
      res.json({success, token})
    }
    catch(error)
    {
      console.error(error.message)
      res.status(500).send("Oops! Some Intrnal Error Occured!")
    }
  })
    
    // Logging a user
    route.post('/login', [
      body('email','Enter a valid email').isEmail(),
      body('password',"Passwrd can't be blank").exists()
  ],async (req,res)=> {
    let success=false
    try{
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            success=false
            return res.status(400).json({success, errors: errors.array() });
          }
          const {email,password}= req.body
          let userCheck= await User.findOne({email});
          if(!userCheck)
          {
            return res.status(400).json({success, errors: "Please enter a valid credentials." });
          }
          let passCheck= await  bcrypt.compare(password,userCheck.password)
          if(!passCheck)
          {
            return res.status(400).json({success,  errors: "Please enter a valid credentials." });
          }
          const user={
            user:{
              id:userCheck.id
            }
          }
          var token = jwt.sign(user, JsonAuthSign);
          success=true
          res.json({success, token})
     }
     catch(error)
    {
      console.error(error)
      res.status(500).send("Oops! Some Intrnal Error Occured!")
    }
  })
    // Get details of a usr using auth token
    route.post('/getdata',featchUser,async (req,res)=> {
    try{
      
      const userId= req.user.id;
      let data=await User.findById(userId).select("-password")
      res.send(data)
    }  
    catch(error)
    {
      console.error(error)
      res.status(500).send("Oops! Some Intrnal Error Occured!")
    }  
})

module.exports= route 