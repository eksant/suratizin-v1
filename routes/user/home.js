const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Home'

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
            }
          })
          .then(function(items) {
            callback({
              content     : 'home',
              setting     : setting[0],
              title       : title,
              user        : user,
              itemId      : 0, //'List Permohonan Jasa',
              items       : items,
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
