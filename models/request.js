'use strict';
const library      = require('../helpers/library')
const getCategory  = require('../helpers/getCategory')
const Op           = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Request = sequelize.define('Request', {
    UserId: DataTypes.INTEGER,
    AdminId: DataTypes.INTEGER,
    location_province: DataTypes.INTEGER,
    location_city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'City must be filled !!'
        },
      }
    },
    necessities: DataTypes.STRING,
    photo_building: DataTypes.STRING,
    photo_plan: DataTypes.STRING,
    attachment: DataTypes.STRING,
    needed_date: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Needed date must be filled !!'
        },
      }
    },
    remark: DataTypes.TEXT,
    payment_method: DataTypes.INTEGER,
    status: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must be filled !!'
        },
        isUnique: function(value, next) {
          Request.findAll({
            where:{
              title: value,
              id: { [Op.ne]: this.id, },
            }
          })
          .then(function(request) {
            if (request.length == 0) {
              next()
            } else {
              next('Title permohonan sudah terdaftar !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    category: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category must be filled !!'
        },
      }
    },
    sub_category: DataTypes.INTEGER,
  });

  Request.prototype.getCategory = function() {
    return getCategory(this.category)
  }

  Request.prototype.getFormatLocalDate = function() {
    return library.formatLocalDate(this.needed_date)
  }

  Request.associate = function(models) {
    Request.belongsTo(models.User)
    Request.hasMany(models.Propose)
  }

  return Request;
};
