const userQueries = require("../db/queries.users")
const wikiQueries = require("../db/queries.wikis")
const passport = require("passport")
const secretKey = process.env.SECRET_KEY
const publishableKey = process.env.PUBLISHABLE_KEY
const stripe = require("stripe")(secretKey)

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
  },

  upgrade(req, res, next){
    res.render("user/upgrade", {publishableKey}) //change key
  },

  payment(req, res, next){
    let payment = 1500
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
    })
    .then((customer)=>{
      stripe.charges.create({
        amount: payment,
        description: "Account Upgrade",
        currency: "USD",
        customer: customer.id
      })
    })
    .then((charge)=>{
      userQueries.upgrade(req.user.dataValues.id)
      res.render("user/payment_success")
    })
  },

  downgrade(req, res, next){
    userQueries.downgrade(req.user.dataValues.id)
    req.flash("notice", "no longer premium")
    res.redirect("/")
  },

  showCollaborations(req, res, next){
    userQueries.getUser(req.user.id, (err, result)=>{
      user = result["user"]
      collaborations = result["collaborations"]
      if(err || user == null){
        res.redirect(404, "/")
      } else {
        res.render("user/collaborations, {user, collaborations}")
      }
    })
  }
}
