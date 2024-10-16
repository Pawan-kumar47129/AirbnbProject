const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listingController = require("../controller/listing.controller.js");
const { isLoggedIn, listingValidation, isOwner } = require("../middleware.js");

//index Route
router.get("/", wrapAsync(listingController.index));

// new listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// create route
router.post(
  "/",
  [isLoggedIn, listingValidation],
  wrapAsync(listingController.createListing)
);

// show Route
router.get("/:id", wrapAsync(listingController.showListing));

//edit route
router.get(
  "/:id/edit",
  [isLoggedIn, isOwner],
  wrapAsync(listingController.renderEditForm)
);

//update Route
router.put(
  "/:id",
  [isLoggedIn, isOwner, listingValidation],
  wrapAsync(listingController.updateListing)
);

// delete route
router.delete(
  "/:id",
  [isLoggedIn, isOwner],
  wrapAsync(listingController.distroyListing)
);

module.exports = router;
