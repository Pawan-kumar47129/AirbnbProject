const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.model.js");
const passport = require("passport");
const { setRedirctUrl } = require("../middleware.js");
const router = express.Router();
router.get("/signup", (req, res) => {
    res.render("user/signup.ejs");
});
router.post(
    "/signup",
    wrapAsync(async (req, res, next) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ username, email });
            const registorUser = await User.register(newUser, password);
            console.log(registorUser);
            // after signup user go login automatically
            req.logIn(registorUser,(err)=>{
                if(err){
                    next(err);
                }
                else{
                    req.flash("success", "wecome to int airbnb");
                    res.redirect("/listings");
                }
            })
           
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/signup");
        }
    })
);
router.get("/login", (req, res) => {
    res.render("user/login.ejs");
});

router.post(
    "/login",
    setRedirctUrl,//setRedirectUrl calls because after login passport reset the req.session object so we not get req.session.redirctUrl so we store the url in res.locals
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        const { username } = req.body;
        //req.session.User=username;// this work done by passport means possport store user data in current session
        //res.cookie("name", username);
        const user=await User.find({username:username});
        //console.log(user);
        req.flash("success", `welcome back to ${username}`);
        //res.redirect(req.session.redirectUrl);// generally this work but posspost reset the seesion object so not work so we store in locals before reset of session object so we call setRedirect middleware
        const redirectUrl=res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
    }
);

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you logout successfully");
        res.redirect("/listings");
    })
})
module.exports = router;
