'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: "should be valid email"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wikis"
    })
    User.hasMany(models.Collaborator, {
      foreignKey: "userId",
      as: "collaborators"
    })
    User.prototype.isAdmin = function(){
      return this.role === "admin"
    }
    User.prototype.isOwner = function(){
      return this.role === "owner"
    }
    User.prototype.isPremium = function(){
      return this.role === "premium"
    }
    User.prototype.isStandard = function(){
      returm this.role === "standard"
    }
  };
  return User;
};
