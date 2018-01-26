const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Home'

module.exports.get = function(id, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(id)
    .then(function(user) {
      if (user) {
        callback({
          content     : 'home',
          setting     : setting[0],
          library     : library,
          title       : title,
          user        : user,
          alert       : null,
        })
      } else {
        callback({
          content     : 'home',
          setting     : setting[0],
          library     : library,
          title       : title,
          user        : null,
          alert       : null,
        })
      }
    })
  })
}

module.exports.delete = function(id, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.destroy({
      where: {
        id: id,
      }
    })
    .then(function() {
      callback({
        content     : 'home',
        setting     : setting[0],
        library     : library,
        title       : title,
        user        : null,
        alert       : message.success(),
      })
    })
  })
}
