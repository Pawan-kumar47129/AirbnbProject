module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;// suppose user want create or edit or .. so hit that url but user not login so we store that url so that we user login then we redirect that url after login 
        req.flash("error","You must be first logged in");
        res.redirect("/login");
      }
    else next();  
}
module.exports.setRedirctUrl=(req,res,next)=>{
  res.locals.redirectUrl=req.session.redirectUrl;
  console.log(res.locals.redirectUrl);
  next();
}