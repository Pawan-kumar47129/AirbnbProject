const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.route.js");
const reviewRouter=require("./routes/review.route.js");
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
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)// here we have listing id as params but when it go to reviewRouter or childRouter then id params not goes but if we want to go parent params id to child router so we use in Router function inside we pass a option {mergeParams:true} this is written in route files check 
app.get("/", (req, res) => {
  res.send("hi i am root");
});
// this works when above not hitting any url or route
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
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
