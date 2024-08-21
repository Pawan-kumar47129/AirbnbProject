const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const app = express();
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const methodOveride=require("method-override");
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
app.use(methodOveride("_method"))
//index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.log(err);
  }
});

// new listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// create route
app.post("/listings", async (req, res) => {
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  console.log(newListing);
  res.redirect("/listings");
});
// show Route
app.get("/listings/:id",async(req,res)=>{
  let id=req.params.id;
  const listing=await Listing.findById(id); 
  res.render("listings/show.ejs",{listing});
})

//edit route
app.get("/listings/:id/edit",async(req,res)=>{
  let id=req.params.id;
  let listing=await Listing.findById(id);
  res.render("listings/edit.ejs",{listing})
})
//update Route
app.put("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing})// derefrence
  res.redirect(`/listings/${id}`)
})

// delete route
app.delete("/listings/:id",async(req,res)=>{
  let {id}=req.params;
  let deletingdata=await Listing.findByIdAndDelete(id);
  console.log(deletingdata);
  res.redirect("/listings");
})
app.get("/", (req, res) => {
  res.send("hi i am root");
});
app.listen(8080, (err) => {
  if (err) {
    console.Log(err);
  } else {
    console.log(`server start at 8080 port number`);
  }
});


//listing%5Btitle%5D=My+home&listing%5Bdescription%5D=sweet+house&listing%5Bimage%5D=https%3A%2F%2Fplus.unsplash.com%2Fpremium_photo-1723492163651-c788d9a369f8%3Fq%3D80%26w%3D2072%26auto%3Dformat%26fit%3Dcrop%26ixlib%3Drb-4.0.3%26ixid%3DM3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%253D%253D&listing%5Bprice%5D=1200&listing%5Blocation%5D=Dehli&listing%5Bcountry%5D=India