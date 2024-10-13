const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.model.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.validation.js");
const { isLoggedIn } = require("./middleware.js");
//index Route
router.get(
  "/",
  wrapAsync(async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// new listing Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});
//listing validation
const listingValidation = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
// create route
router.post(
  "/",
  [isLoggedIn, listingValidation],
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  })
);
// show Route
router.get(
  "/:id",
  wrapAsync(async (req, res, next) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing not exist");
      res.redirect("/listings");
      return;
    }
    res.render("listings/show.ejs", { listing });
  })
);

//edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      res.redirect("/listings");
      return;
    }
    res.render("listings/edit.ejs", { listing });
  })
);
//update Route
router.put(
  "/:id",
  [isLoggedIn, listingValidation],
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    if (!req.body.listing) {
      throw next(new ExpressError(400, "Listing Data You Not Pass"));
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // derefrence
    req.flash("success", "Listing update successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletingdata = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);
module.exports = router;
