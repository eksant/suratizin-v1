const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Home'

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      if (!user) {
        callback(null)
      }
      callback({
        content     : 'home',
        setting     : setting[0],
        title       : title,
        user        : user,
        alert       : null,
      })
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
