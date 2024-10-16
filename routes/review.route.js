const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewController = require("../controller/review.controller.js");
const {
  reviewValidation,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync");

//post review route
router.post(
  "/",
  [isLoggedIn, reviewValidation],
  wrapAsync(reviewController.createReview)
);

//delete review route
router.delete(
  "/:reviewId",
  [isLoggedIn, isReviewAuthor],
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
