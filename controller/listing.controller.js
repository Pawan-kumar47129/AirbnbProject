const Listing = require("../models/listing.model.js");
module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};
module.exports.showListing = async (req, res, next) => {
  let id = req.params.id;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner"); //inside reviews we populate auther
  if (!listing) {
    req.flash("error", "Listing not exist");
    res.redirect("/listings");
    return;
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let id = req.params.id;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    res.redirect("/listings");
    return;
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // derefrence
  req.flash("success", "Listing update successfully!");
  res.redirect(`/listings/${id}`);
};
module.exports.distroyListing = async (req, res, next) => {
  let { id } = req.params;
  let deletingdata = await Listing.findByIdAndDelete(id); //also delete relate reviews in modelSchema
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
