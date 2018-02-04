'use strict';
const getRole   = require('../helpers/getRole')
const library   = require('../helpers/library')
const Op        = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    AdminId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must be filled !!'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email must be filled !!'
        },
        isUnique: function(value, next) {
          User.findAll({
            where:{
              email: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(user) {
            if (user.length == 0) {
              next()
            } else {
              next('Email already used !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password must be filled !!'
        },
        len: {
          args: [6, 255],
          msg: 'Password at least 6 characters !!'
        }
      }
    },
    role: {
      type: DataTypes.INTEGER,
      validate: {
        customValidation: function(value, next) {
          if (value == '') {
            next('Please choose a role !!')
          } else {
            next()
          }
        }
      }
    },
    gender: DataTypes.INTEGER,
    handphone: DataTypes.STRING,
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    reset_token: DataTypes.STRING,
    reset_expired: DataTypes.DATE,
    status: DataTypes.INTEGER,
    latitude: DataTypes.STRING,
    longitude: DataTypes.STRING,
    addressMaps:DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        user.password = library.encrypt(user.password)
      },
      beforeUpdate: (user, options) => {
        user.password = library.encrypt(user.password)
      }
    }
  });

  User.prototype.check_password = function (userPassword, callback) {
    if (library.comparePassword(userPassword, this.password)) {
      callback(true)
    }else{
      callback(false)
    }
  }

  User.prototype.getRole = function() {
    return getRole(this.role)
  }

  User.associate = function(models) {
    User.hasMany(models.Request)
    User.hasMany(models.Company)
    User.hasMany(models.Portofolio)
    User.hasMany(models.Propose)
  }

  return User;
};
