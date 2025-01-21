const User = require("../models/user.model.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("user/signup.ejs");
};
module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registorUser = await User.register(newUser, password);
    // console.log(registorUser);
    // after signup user go login automatically
    req.logIn(registorUser, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "wecome to in airbnb");
        res.redirect("/listings");
      }
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.login = async (req, res) => {
  const { username } = req.body;
  //req.session.User=username;// this work done by passport means possport store user data in current session so we not need
  //res.cookie("name", username);
  const user = await User.find({ username: username });
  //console.log(user);
  req.flash("success", `welcome back to ${username}`);
  //res.redirect(req.session.redirectUrl);// generally this work but posspost reset the seesion object so not work so we store in locals before reset of session object so we call setRedirect middleware in route page
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you logout successfully");
    res.redirect("/listings");
  });
};
