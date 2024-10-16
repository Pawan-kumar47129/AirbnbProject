const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controller/user.controller.js");
const passport = require("passport");
const { setRedirctUrl } = require("../middleware.js");
const router = express.Router();

//render signup form
router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  [
    setRedirctUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    })
  ],
  wrapAsync(userController.login)
); //setRedirectUrl middleware calls because after login passport reset the req.session object so we not get req.session.redirctUrl so we store the url in res.locals

router.get("/logout",userController.logOut);

module.exports = router;
