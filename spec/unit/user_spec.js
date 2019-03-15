const User = require("../../src/db/models").User
const sequelize = require("../../src/db/models/index").sequelize

describe("User", ()=>{
  beforeEach((done)=>{
    sequelize.sync({force: true})
    .then((res)=>{
      done()
    })
    .catch((err)=>{
      console.log(err)
      done()
    })
  })

  describe("#create()", ()=>{
    it("should create user model", (done)=>{
      User.create({
        username: "me",
        email: "me@email.com",
        password: "123456"
      })
      .then((user)=>{
        expect(user.username).toBe("me")
        expect(user.email).toBe("me@email.com")
        expect(user.id).toBe(1)
        done()
      })
      .catch((err)=>{
        console.log(err)
        done()
      })
    })

    it("should not create user model", (done)=>{
      User.create({
        username: "me",
        email: "invalid",
        password: "123456"
      })
      .then((user)=>{
        done()
      })
      .catch((err)=>{
        expect(err.message).toContain("error")
        done()
      })
    })

    it("should not duplicate users", (done)=>{
      User.create({
        username: "me",
        email: "me@email.com",
        password: "123456"
      })
      .then((user)=>{
        username: "me",
        email: "me@email.com",
        password: "1234"
      })
      .then((user)=>{
        done()
      })
      .catch((err)=>{
        console.log(err)
        done()
      })
    })
  })
})
