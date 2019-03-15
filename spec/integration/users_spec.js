const request = require("request")
const server = require("../../src/server")
const base = "http://localhost:3000/users"
const User = require("../../src/db/models").User
const sequelize = require("../../src/db/models/index").sequelize

describe("routes : users", ()=>{
  beforeEach((done)=>{
    sequelize.sync({force: true})
    .then(()=>{
      done()
    })
    .catch((err)=>{
      console.log(err)
      done()
    })
  })

  describe("GET /user/sign_up", ()=>{
    it("should render signup form", (done)=>{
      request.get(`${base}sign_up`, (err, res, body)=>{
        expect(err).toBeNull()
        expect(body).toContain("Sign Up")
        done()
      })
    })
  })

  describe("POST /users/sign_up", ()=>{
    it("should create a new user and redirect", (done)=>{
      const options = {
        url: `${base}sign_up`,
        form: {
          username: "me",
          email: "me@email.com",
          password: "123456"
        }
      }

      request.post(options, (err, res, body)=>{
        User.findOne({where: {username: "me"}})
        .then((user)=>{
          expect(user).not.toBeNull()
          expect(user.email).toBe("me@email.com")
          expect(user.id).toBe(1)
          done()
        })
        .catch((err)=>{
          console.log(err)
          done()
        })
      })
    })

    it("should create hashed password", (done)=>{
      const options = {
        url: `${base}sign_up`,
        form: {
          username: "me",
          email: "me@email.com",
          password: "123456"
        }
      }

      request.post(options, (err, res, body)=>{
        User.findOne({where: {username: "me"}})
        .then((user)=>{
          expect(user).not.toBeNull()
          expect(user.email).toBe("me@email.com")
          expect(user.id).toBe(1)
          expect(user.password).not.toBe("123456")
          done()
        })
        .catch((err)=>{
          console.log(err)
          done()
        })
      })
    })

    it("should not create a new user with error and then redirect", (done)=>{
      request.post({
        url: `${base}sign_up`,
        form: {
          username: "me",
          email: "invalid",
          password: "123456"
        }
      }, (err, res, body)=>{
        User.findOne({where: {email: "invalid"}})
        .then((user)=>{
          expect(user).toBeNull()
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
