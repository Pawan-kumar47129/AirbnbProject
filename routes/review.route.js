const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.model.js")
const Review=require("../models/review.model.js")
const {reviewSchema}=require('../schema.validation');
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const reviewValidation = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };
  //post review route
  router.post(
    "/",
    reviewValidation,
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      console.log(listing);
      let newReview = new Review(req.body.review);
      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
      console.log("reviews add");
      req.flash("success","Review added successfully!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  //delete review route
  router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      console.log(id,reviewId);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// pull delete the matching data from reviews array
      await Review.findByIdAndDelete(id);
      req.flash("success","Review deleted successfully!");
      res.redirect(`/listings/${id}`);
    })
  );
  module.exports=router;