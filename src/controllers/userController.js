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
  }
}
