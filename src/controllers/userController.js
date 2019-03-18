const userQueries = require("../db/queries.user")
const passport = require("passport")

module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up")
  },

  create(req, res, next){
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    }
    userQueries.createUser(newUser, (err, user)=>{
      if(err){
        console.log(err)
        req.flash("error", err)
        res.redirect("users/sign_up")
      } else {
        passport.authenticate("local")(req, res, ()=>{
          req.flash("notice", "signup completed")
          res.redirect("/")
        })
      }
    })
  },

  signInForm(req, res, next){
    res.render("user/sign_in")
  },

  signIn(req, res, next){
    passport.authenticate("local")(req, res, ()=>{
      if(!req.user){
        req.flash("notice", "Sign-in failed. Try again.")
        res.redirect("/users/sign_in")
      } else {
        req.flash("notice", "Sign-in successful.")
        res.redirect("/")
      }
    })
  },

  signOut(req, res, next){
    req.logout()
    req.flash("notice", "Sign-out successful.")
    res.redirect("/")
  }
}
