const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.model.js");
const passport=require("passport");
const router=express.Router();
router.get("/signup",(req,res)=>{
    res.render("user/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res,next)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const registorUser=await User.register(newUser,password);
        console.log(registorUser);
        req.flash("success","wecome to int airbnb")
        res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}))
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})

router.post("/login",passport.authenticate('local',{failureRedirect: '/login',failureFlash:true}),async(req,res)=>{
    const {username}=req.body;
    //req.session.User=username;// this work done by passport 
    req.flash("success",`welcome back to ${username}`);
    res.redirect("/listings");

})
module.exports=router;