const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const app = express();
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const methodOveride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema=require("./schema.validation.js")
const Review = require("./models/review.js");
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
//index Route
app.get(
  "/listings",
  wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//listing validation
const listingValidation=(req,res,next)=>{
  const {error}=listingSchema.validate(req.body);
  if(error){
    throw new ExpressError(400,error);
  }
  else{
    next();
  }
}
// create route
app.post(
  "/listings",
  listingValidation,wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);
// show Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);
//update Route
app.put(
  "/listings/:id",
  listingValidation,wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    if (!req.body.listing) {
      throw next(new ExpressError(400, "Listing Data You Not Pass"));
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // derefrence
    res.redirect(`/listings/${id}`);
  })
);

// delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletingdata = await Listing.findByIdAndDelete(id);
    console.log(deletingdata);
    res.redirect("/listings");
  })
);
//reviews
//post route
app.post("/listings/:id/reviews", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing);
  let newReview = new Review(req.body.review);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  console.log("reviews add");
  res.send("add");
});
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
