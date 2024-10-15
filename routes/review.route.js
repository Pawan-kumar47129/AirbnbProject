const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.model.js")
const Review=require("../models/review.model.js")
const {reviewValidation, isLoggedIn, isReviewAuthor}=require('../middleware.js');
const wrapAsync=require("../utils/wrapAsync");
  //post review route
  router.post(
    "/",
    [isLoggedIn,
    reviewValidation],
    wrapAsync(async (req, res) => {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      //console.log(listing);
      let newReview = new Review(req.body.review);
      newReview.author=req.user._id;
      listing.reviews.push(newReview);
      //console.log(newReview); 
      await newReview.save();
      await listing.save();
      //console.log("reviews add");
      req.flash("success","Review added successfully!");
      res.redirect(`/listings/${listing._id}`);
    })
  );
  
  //delete review route
  router.delete(
    "/:reviewId",
    [isLoggedIn,isReviewAuthor],
    wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
      //console.log(id,reviewId);
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// pull delete the matching data from reviews array
      await Review.findByIdAndDelete(reviewId);
      req.flash("success","Review deleted successfully!");
      res.redirect(`/listings/${id}`);
    })
  );
  module.exports=router;