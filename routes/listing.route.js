const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.model.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, listingValidation, isOwner } = require("../middleware.js");
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
// create route
router.post(
  "/",
  [isLoggedIn, listingValidation],
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
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
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
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
  [isLoggedIn, isOwner],
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
  [isLoggedIn, isOwner, listingValidation],
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // derefrence
    req.flash("success", "Listing update successfully!");
    res.redirect(`/listings/${id}`);
  })
);

// delete route
router.delete(
  "/:id",
  [isLoggedIn, isOwner],
  wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let deletingdata = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  })
);
module.exports = router;
