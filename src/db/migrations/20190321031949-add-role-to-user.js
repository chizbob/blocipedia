'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      "Users",
      "role", {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: "standard"
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("User", "role")
  }
};
