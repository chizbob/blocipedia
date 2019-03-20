'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wikis = sequelize.define('Wikis', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {});
  Wikis.associate = function(models) {
    Wikis.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    })
  };
  return Wikis;
};
