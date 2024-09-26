const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.model.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.validation.js");
//index Route
router.get(
    "/",
    wrapAsync(async (req, res, next) => {
      const allListings = await Listing.find({});
      res.render("listings/index.ejs", { allListings });
    })
  );
  
  // new listing Route
  router.get("/new", (req, res) => {
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
    listingValidation,
    wrapAsync(async (req, res, next) => {
      let newListing = new Listing(req.body.listing);
      await newListing.save();
      res.redirect("/listings");
    })
  );
  // show Route
  router.get(
    "/:id",
    wrapAsync(async (req, res, next) => {
      let id = req.params.id;
      const listing = await Listing.findById(id).populate("reviews");
      res.render("listings/show.ejs", { listing });
    })
  );
  
  //edit route
  router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
      let id = req.params.id;
      let listing = await Listing.findById(id);
      res.render("listings/edit.ejs", { listing });
    })
  );
  //update Route
  router.put(
    "/:id",
    listingValidation,
    wrapAsync(async (req, res, next) => {
      let { id } = req.params;
      if (!req.body.listing) {
        throw next(new ExpressError(400, "Listing Data You Not Pass"));
      }
      await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // derefrence
      res.redirect(`/listings/${id}`);
    })
  );
  
  // delete route
  router.delete(
    "/:id",
    wrapAsync(async (req, res, next) => {
      let { id } = req.params;
      let deletingdata = await Listing.findByIdAndDelete(id);
      console.log(deletingdata);
      res.redirect("/listings");
    })
  );
  module.exports=router;