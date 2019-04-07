const Wiki = require("./models").Wiki
const User = require("./models").User
const Collaborator = require("./models").Collaborator
const Authorizer = require("../policies/application")

module.exports = {
  getAllWikis(callback){
    return Wiki.all()
    .then((wikis)=>{
      callback(null, wikis)
    })
    .catch((err)=>{
      callback(err)
    })
  },

  getWiki(id, callback){
    let result = {}
    return Wiki.findById(id)
    .then((wiki)=>{
      if(!wiki){
        callback(404)
      } else {
        result["wiki"] = wiki
        Collaborator.scope({
          method: ["collaboratorsFor", id]
        }).all()
        .then((collaborators)=>{
          result["collaborators"] = collaborators
          callback(null, result)
        })
        .catch((err)=>{
          callback(err)
        })
      }
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
