const Authorizer = require("../policies/wiki")
const Wiki = require("./models").Wiki

module.exports = {
  getAllWikis(callback){
    return Wikis.all()
    .then((wikis)=>{
      callback(null, wikis)
    })
    .catch((err)=>{
      callback(err)
    })
  },

  getWiki(id, callback){
    return Wikis.findById(id)
    .then((wiki)=>{
      callback(null, wiki)
    })
    .catch((err)=>{
      callback(err)
    })
  },

  private(id){
    return Wiki.all()
    .then((wikis)=>{
      wikis.forEach((wiki)=>{
        if(wiki.userId == id && wiki.private == true){
          wiki.update({
            private: false
          })
        }
      })
    })
    .catch((err)=>{
      console.log(err)
    })
  },

  addWiki(newWiki, callback){
    return Wikis.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki)=>{
      callback(null, wiki)
    })
    .catch((err)=>{
      callback(err)
    })
  },

  updateWiki(req, updatedWiki, callback){
    return Wikis.findById(req.params.id)
    .then((wiki)=>{
      if(!wiki){
        return callback("Wiki doesn't exist")
      }
      const authorized = new Authorizer(req.user, wiki).update()
      if(authorized){
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then((wiki)=>{
          callback(null, wiki)
        })
        .catch((err)=>{
          callback(err)
        })
      } else {
        req.flash("notice", "Not authorized")
        callback("Forbidden")
      }
    })
  },

  deleteWiki(req, callback){
    return Wikis.findById(req.params.id)
    .then((wiki)=>{
      const authorized = new Authorizer(req.user, wiki).destroy()
      if(authorized){
        wiki.destroy()
        .then((res)=>{
          callback(null, wiki)
        })
      } else {
        req.flash("notice", "Not authorized")
        callback(401)
      }
    })
    .catch((err)=>{
      callback(err)
    })
  }
}
