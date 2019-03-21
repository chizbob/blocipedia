const request = require("request")
const server = require("../../src/server")
const base = "http://localhost:3000/wikis/"
const User = require("../../src/db/models").User
const Wiki = require("../../src/db/models").Wiki
const sequelize = require("../../src/db/models/index").sequelize

describe("routes :  wikis", ()=>{
  beforeEach((done)=>{
    this.user
    this.wiki
    sequelize.sync({force: true})
    .then((res)=>{
      User.create({
        username: "me",
        email: "me@email.com",
        password: "123456",
        role: "standard"
      })
      .then((user)=>{
        this.user = user
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            id: user.id,
            username: user.name,
            email: user.email,
            role: user.role
          }
        })
        Wiki.create({
          title: "Wiki",
          body: "Wiki pages",
          userId: user.id
        })
        .then((wiki)=>{
          this.wiki = wiki
          done()
        })
        .catch((err)=>{
          console.log(err)
          done()
        })
      })
      .catch((err)=>{
        console.log(err)
        done()
      })
    })
  })

  describe("GET /wikis", ()=>{
    it("should render wiki page", (done)=>{
      request.get(base, (err, res, body)=>{
        expect(err).toBeNull()
        expect(body).toContain("Wiki")
        done()
      })
    })
  })

  describe("GET /wikis/new", ()=>{
    it("should render a new wiki form", (done)=>{
      request.get(`${base}new`, (err, res, body)=>{
        expect(err).toBeNull()
        expect(body).toContain("Wiki")
        done()
      })
    })
  })

  describe("POST /wikis/create", ()=>{
    it("should create a wiki and redirect", (done)=>{
      const options = {
        url: `${base}create`,
        form: {
          title: "New wiki",
          body: "New wiki body",
          userId: this.user.id
        }
      }

      request.post(options, (err, res, body)=>{
        Wiki.findOne({where: {title: "New wiki"}})
        .then((wiki)=>{
          expect(wiki.title).toBe("New wiki")
          expect(wiki.body).toBe("New wiki body")
          done()
        })
        .catch((err)=>{
          console.log(err)
          done()
        })
      })
    })
  })

  describe("GET /wikis/:id", ()=>{
    it("should render the wiki", (done)=>{
      request.get(`${base}${this.wiki.id}`, (err, res, body)=>{
        expect(err).toBeNull()
        expect(body).toContain("Wiki pages")
        done()
      })
    })
  })

  describe("POST /wikis/:id/update", ()=>{
    it("should update the wiki", (done)=>{
      request.post({
        url: `${base}${this.wiki.id}/update`,
        form: {
          title: "Wiki",
          body: "Wiki pages",
          userId: this.user.id
        }
      }, (err, res, body)=>{
        expect(err).toBeNull()
        Wiki.findOne({where: {id: 1}})
      })
      .then((wiki)=>{
        expect(wiki.title).toBe("Wiki pages")
        done()
      })
      .catch((err)=>{
        console.log(err)
        done()
      })
    })
  })

  describe("POST /wikis/:id/destroy", ()=>{
    it("should delete the wiki with the ID", (done)=>{
      Wiki.all()
      .then((wikis)=>{
        const wikiCountBeforeDelete = wikis.isLength
        expect(wikiCountBeforeDelete).toBe(1)
        request.post(`${base}${this.wiki.id}/destroy`,
          (err, res, body)=>{
            Wiki.all()
            .then((wikis)=>{
              expect(err).toBeNull()
              expect(wikis.length).toBe(wikiCountBeforeDelete -1)
              done()
            })
            .catch((err)=>{
              console.log(err)
              done()
            })
          })
      })
    })
  })
})
