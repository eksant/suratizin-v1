const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Edit Profile'

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      callback({
        content     : 'profile_form',
        setting     : setting[0],
        title       : title,
        user        : user,
        alert       : null,
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      let uploadPhoto = req.body.photo
      if (uploadPhoto == '') {
        uploadPhoto = user.photo
      }
      let objUser = {
        id                  : res.locals.userSession.id,
        name                : req.body.name,
        gender              : req.body.gender,
        handphone           : req.body.handphone,
        address             : req.body.address,
        photo               : uploadPhoto,
        password            : req.body.password,
        new_password_repeat : req.body.new_password_repeat,
      }

      if (objUser.password != objUser.new_password_repeat) {
        callback({
          content     : 'profile_form',
          setting     : setting[0],
          title       : title,
          user        : objUser,
          alert       : message.error('Password baru tidak sesuai dengan password yang di ulangi !!'),
        })
      } else {
        var hooks = true
        delete objUser.new_password_repeat
        objUser.updatedAt = new Date()

        if (objUser.password == '') {
          hooks = false
          delete objUser.password
        }

        Model.User.update(objUser, {
          where: {
            id: objUser.id,
          },
          individualHooks: hooks,
        })
        .then(function() {
          Model.User.findById(objUser.id)
          .then(function(newUser) {
            req.session.user       = newUser
            res.locals.userSession = req.session.user
            callback({
              content     : 'profile_form',
              setting     : setting[0],
              title       : title,
              user        : newUser,
              alert       : message.success(),
            })
          })
        })
        .catch(function(err) {
          callback({
            content     : 'profile_form',
            setting     : setting[0],
            title       : title,
            user        : objUser,
            alert       : message.error(err.message),
          })
        })
      }
    })
  })
}
