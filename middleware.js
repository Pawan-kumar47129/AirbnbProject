const Listing = require("./models/listing.model.js");
const ExpressError = require("./utils/ExpressError.js");
const {
  listingSchemaValidation,
  reviewSchemaValidation,
} = require("./schema.validation.js");
const wrapAsync = require("./utils/wrapAsync.js");
const Review = require("./models/review.model.js");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; // suppose user want create or edit or .. so hit that url but user not login so we store that url so that when user login then we redirect that url after login
    req.flash("error", "You must be first logged in");
    res.redirect("/login");
  } else next();
};
module.exports.setRedirctUrl = (req, res, next) => {
  let index=req.session.redirectUrl?.indexOf("reviews");
  if(index==-1){
    res.locals.redirectUrl = req.session.redirectUrl;
  }else{
    res.locals.redirectUrl=req.session.redirectUrl?.substring(0,index);
  }
  //console.log(res.locals.redirectUrl);
  next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (req.user && !listing.owner.equals(req.user._id)) {
    req.flash("error", "you are not owner of this listing");
    res.redirect(`/listings/${id}`);
  } else {
    next();
  }
});
module.exports.isReviewAuthor= wrapAsync(async (req, res, next) => {
  const {id,reviewId} = req.params;
  const review= await Review.findById(reviewId);
  if (req.user && !review.author.equals(req.user._id)) {
    req.flash("error", "you have no permission to delete this review");
    res.redirect(`/listings/${id}`);
  } else {
    next();
  }
});
//listing schema validation
module.exports.listingValidation = (req, res, next) => {
  const { error } = listingSchemaValidation.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
//Review schema validation
module.exports.reviewValidation = (req, res, next) => {
  const { error } = reviewSchemaValidation.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
