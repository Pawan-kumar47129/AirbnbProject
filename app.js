const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path=require("path");
const app = express();
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

mongoose
  .connect(MONGO_URL)
  .then((res) => {
    console.log("data base connected seccussfully");
  })
  .catch((err) => {
    console.log(err);
  });
 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))  
//index Route
app.get("/listings",async (req, res) => {
  
  try {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs",{allListings});
  } catch (err) { 
    console.log(err);
  }
}); 

// show Route
app.get("/", (req, res) => {
  res.send("hi i am root");
});
app.listen(8080, (err) => {
  if (err) {
    console.timeLog(err);
  } else {
    console.log(`server start at 8080 port number`);
  }
});
