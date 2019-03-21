const User = require("../../src/db/models").User
const Wiki = require("../../src/db/models").Wiki
const sequelize = require("../../src/db/models/index").sequelize

describe("Wiki", ()=>{
  beforeEach((done)=>{
    this.wiki
    this.user

    sequelize.sync({force: true})
    .then((res)=>{
      User.create({
        username: "me",
        email: "me@email.com",
        password: "123456"
        role: "standard"
      })
      .then((user)=>{
        this.user = user
        Wiki.create({
          title: "Wiki",
          body: "Wiki pages",
          userId: user.id
        })
        .then((wiki)=>{
          this.wiki = wiki
          done()
        })
      })
    })
  })

  describe("#create()", ()=>{
    it("should create wiki object", (done)=>{
      Wiki.create({
        title: "New Wiki",
        body: "This is a new wiki"
      })
      .then((newWiki)=>{
        except(newWiki.title).toBe("New Wiki")
        expect(newWiki.body).toBe("This is a new wiki")
        done()
      })
      .catch((err)=>{
        expect(err).toBeNull()
        console.log(err)
        done()
      })
    })

    it("should not create a wiki", (done)=>{
      Wiki.create({
        title: "No Wiki"
      })
      .then((newWiki)=>{
        done()
      })
      .catch((err)=>{
        expect(err.message).toContain("cannot be null")
        done()
      })
    })
  })
})
