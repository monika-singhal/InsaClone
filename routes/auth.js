const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User= mongoose.model("User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
router.get('/protected',requireLogin,(req,res)=>{
    res.send("Allowed to access protected things")
})
router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body;
    if(!email||!password||!name)
    {
        return res.status(422).json({error:"Please fill all details"});

    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser)
        return res.status(422).json({error:"User Already exists"});
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                name,
                password:hashedpassword,
                pic
            })
            user.save()
            .then(user=>{
                res.send({message:"Saved Successfully"});
            })
            .catch(err=>{
                console.log(er)
            })
        })
        

    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/signin',(req,res)=>{
    const {email,password}= req.body
    if(!email||!password)
    return res.status(422).json({error:"please add email or password"});
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        return res.status(422).json({error:"please provide valid Details"});
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}= savedUser
                res.send({token,user:{_id,name,email,followers,following,pic}});
                // res.json({message:"Signed in Successfully"});
            }
            else
             return res.status(422).json({error:"please provide valid Details"});

        })
        .catch(err=>{
            console.log(err);
        })

    })
})
module.exports= router