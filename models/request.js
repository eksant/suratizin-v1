'use strict';
const getCategory  = require('../helpers/getCategory')
const Op           = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Request = sequelize.define('Request', {
    UserId: DataTypes.INTEGER,
    AdminId: DataTypes.INTEGER,
    location_province: DataTypes.INTEGER,
    location_city: DataTypes.STRING,
    necessities: DataTypes.STRING,
    photo_building: DataTypes.STRING,
    photo_plan: DataTypes.STRING,
    attachment: DataTypes.STRING,
    needed_date: DataTypes.DATE,
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
              id: this.id,
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
    category: DataTypes.INTEGER,
    sub_category: DataTypes.INTEGER,
  });

  Request.prototype.getCategory = function() {
    return getCategory(this.category)
  }

  Request.associate = function(models) {
    Request.belongsTo(models.User)
  }

  return Request;
};
