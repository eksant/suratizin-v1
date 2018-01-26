'use strict';
const getRole   = require('../helpers/getRole')
const library   = require('../helpers/library')
const Op        = require('sequelize').Op
module.exports = (sequelize, DataTypes) => {
  var Admin = sequelize.define('Admin', {
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
          Admin.findAll({
            where:{
              email: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(admin) {
            if (admin.length == 0) {
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
    gender: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Gender must be filled !!'
        },
      }
    },
    handphone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Mobile no. must be filled !!'
        },
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'address must be filled !!'
        },
      }
    },
    photo: {
      type: DataTypes.STRING,
      // validate: {
      //   notEmpty: {
      //     args: true,
      //     msg: 'photo must be filled !!'
      //   },
      // }
    },
    reset_token: DataTypes.STRING,
    reset_expired: DataTypes.DATE
  },{
    hooks: {
      beforeCreate: (admin, options) => {
        admin.password = library.encrypt(admin.password)
      },
      beforeUpdate: (admin, options) => {
        admin.password = library.encrypt(admin.password)
      }
    }
  });
  Admin.prototype.check_password = function (userPassword, callback) {
    if(library.comparePassword(userPassword,this.password)){
      callback(true)
    }else{
      callback(false)
    }
  }
  Admin.prototype.getRole = function() {
    return getRole(this.role)
  }

  Admin.associate = function(models) {
    Admin.hasMany(models.Request)
  }

  return Admin;
};
