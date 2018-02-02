const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const Op          = require('sequelize').Op
const title       = 'Dashboard Pencarian'

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      if (user) {
        if (user.role == 2 || user.role == 3) {
          Model.Request.findAll({
            where: {
              status: 0,
            },
            include: [Model.User]
          })
          .then(function(items) {
            callback({
              content     : 'home',
              setting     : setting[0],
              title       : title,
              user        : user,
              itemId      : 0, //'List Permohonan Jasa',
              items       : items,
              filter      : null,
              alert       : null,
            })
          })
        } else if (user.role == 4 || user.role == 5) {
          Model.Company.findAll({
            where: {
              validation: 1,
            }
          })
          .then(function(items) {
            callback({
              content     : 'home',
              setting     : setting[0],
              title       : title,
              user        : user,
              itemId      : 1, //'List Mitra Kami',
              items       : items,
              filter      : null,
              alert       : null,
            })
          })
        }
      } else {
        callback(null)
      }
    })
  })
}

module.exports.filter = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      if (user) {
        if (user.role == 2 || user.role == 3) { //'List Permohonan Jasa',
          let objFilter
          if (req.body.location_city != '') {
            objFilter = {
              status        : 0,
              category      : req.body.category,
              location_city : {$iLike: `%${req.body.location_city}%`},
            }
          } else {
            objFilter = {
              status      : 0,
              category    : req.body.category,
            }
          }
          Model.Request.findAll({
            where: objFilter,
            include: [Model.User]
          })
          .then(function(items) {
            callback({
              content     : 'home',
              setting     : setting[0],
              title       : title,
              user        : user,
              itemId      : 0,
              items       : items,
              filter      : objFilter,
              alert       : null,
            })
          })
        } else if (user.role == 4 || user.role == 5) { //'List Mitra Kami',
          let objFilter
          if (req.body.location_city != '') {
             objFilter = {
              validation  : 1,
              category    : req.body.category,
              city        : {$iLike: `%${req.body.location_city}%`},
            }
          } else {
            objFilter = {
             validation  : 1,
             category    : req.body.category,
           }
          }
          Model.Company.findAll({
            where: objFilter
          })
          .then(function(items) {
            callback({
              content     : 'home',
              setting     : setting[0],
              title       : title,
              user        : user,
              itemId      : 1,
              items       : items,
              filter      : objFilter,
              alert       : null,
            })
          })
        }
      } else {
        callback(null)
      }
    })
  })
}

module.exports.delete = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.destroy({
      where: {
        id: res.locals.userSession.id,
      }
    })
    .then(function() {
      callback({
        content     : 'home',
        setting     : setting[0],
        title       : title,
        user        : null,
        alert       : message.success(),
      })
    })
  })
}
