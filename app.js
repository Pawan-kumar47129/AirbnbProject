if(process.env.NODE_ENV!="production"){
  require("dotenv").config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const session= require("express-session");
const flash=require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.route.js");
const reviewRouter=require("./routes/review.route.js");
const userRouter=require("./routes/user.route.js");
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.model.js");
const cookieParser=require('cookie-parser');
mongoose
  .connect(MONGO_URL)
  .then((res) => {
    console.log("data base connected seccussfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(methodOveride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.get("/", (req, res) => {
  return res.redirect('/listings')
  res.send("hi i am root");
});
const sessionOption={
  secret:"supersecretkey",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,//expires in 7days
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
}
app.use(cookieParser("good"));
app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware if any flash present then store in responeLocals object 
app.use((req,res,next)=>{
  // console.log(req.session);// this tells what is store in session
  res.locals.user=req.user;//currUser who are login so that we access in ejs file
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})
/*
app.get("/demouser",async(req,res)=>{
  const fakeUser={
    username:"pawank47129",
    email:"pawan@gmail.com"
  }
  const registorUser=await User.register(fakeUser,"helloWorld");
  res.send(registorUser);
})*/

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)// here we have listing id as params but when it go to reviewRouter or childRouter then id params not goes but if we want to go parent params id to child router so we use in Router function inside we pass a option {mergeParams:true} this is written in route files check 
app.use("/",userRouter);

// this routes works when above not hitting any url or route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
//error middleware to handle error
app.use((err, req, res, next) => {
  const { status = 500, message = "Some Error Occured" } = err;
  res.status(status).render("error.ejs", { status, message });
});
app.listen(8080, (err) => {
  if (err) {
    console.Log(err);
  } else {
    console.log(`server start at 8080 port number`);
  }
});
