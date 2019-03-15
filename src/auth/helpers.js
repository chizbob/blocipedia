const bcrypt = require("bcryptjs")

module.exports = {
  ensureAuthenticate(req, res, next){
    if(!req.user){
      req.flash("notice", "You should be signed in to continue.")
      return res.redirect("/users/sign_in")
    } else {
      next()
    }
  },

  comparePass(userPassword, databasePassword){
    return bcrypt.compareSync(userPassword, databasePassword)
  }
}
