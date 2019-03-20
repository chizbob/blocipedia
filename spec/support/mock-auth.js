module.exports = {
  fakeIt(app){
    let username, email, id, role
    function middleware(req, res, next){
      username = req.body.username || username
      email = req.body.email || email
      id = req.body.userId || id
      role = req.body.role || role

      if(id && id !=0){
        req.user = {
          "username": username,
          "email": email,
          "id": id,
          "role": role
        }
      } else if(id == 0){
        delete req.user
      }
      if(next){
        next()
      }
    }
    function route(req, res){
      res.redirect("/")
    }
    app.user(middleware)
    app.get("/auth/fake", route)
  }
}
