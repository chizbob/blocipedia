'use strict';

const faker = require("faker")

let users = [
  {
    username: "you",
    email: "you@email.com",
    password: "you123456",
    createdAt: new Date(),
    updatedAt: new Date(),
    role: "standard"
  },
  {
    username: "me",
    email: "me@email.com",
    password: "123456",
    createdAt new Date(),
    updatedAt new Date(),
    role: "standard"
  }
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert.("Users", users, {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {})
  }
};
