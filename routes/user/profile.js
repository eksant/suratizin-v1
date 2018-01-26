const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Edit Profile'

module.exports.get = function(id, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(id)
    .then(function(user) {
      callback({
        content     : 'profile',
        setting     : setting[0],
        library     : library,
        title       : title,
        user        : user,
        alert       : null,
      })
    })
  })
}

module.exports.post = function(input, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(input.id)
    .then(function(user) {
      if (input.new_password != input.new_password_repeat) {
        callback({
          content     : 'profile',
          setting     : setting[0],
          library     : library,
          title       : title,
          user        : user,
          alert       : message.error('Incorrect your repeat new password !!'),
        })
      } else {
        var hooks = true
        if (input.new_password == '') {
          hooks = false
          var objUser = {
            id            : input.id,
            name          : input.name,
            gender        : input.gender,
            handphone     : input.handphone,
            address       : input.address,
            updatedAt     : new Date(),
          }
        } else {
          var objUser = {
            id            : input.id,
            name          : input.name,
            gender        : input.gender,
            handphone     : input.handphone,
            address       : input.address,
            password      : input.new_password,
            updatedAt     : new Date(),
          }
        }
        Model.User.update(objUser, {
          where: {
            id: input.id,
          },
          individualHooks: hooks,
        })
        .then(function() {
          Model.User.findById(input.id)
          .then(function(newUser) {
            callback({
              content     : 'profile',
              setting     : setting[0],
              library     : library,
              title       : title,
              user        : newUser,
              alert       : message.success(),
            })
          })
        })
        .catch(function(err) {
          callback({
            content     : 'profile',
            setting     : setting[0],
            library     : library,
            title       : title,
            user        : user,
            alert       : message.error(err.message),
          })
        })
      }
    })
  })
}

module.exports.upload = function(input, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(input.id)
    .then(function(user) {
      let objProfile = {
        id        : user.id,
        photo     : input.photo,
        updatedAt : new Date(),
      }
      Model.User.update(objProfile, {
        where: {
          id: user.id,
        }
      })
      .then(function() {
        Model.User.findById(user.id)
        .then(function(newUser) {
          callback({
            content     : 'profile',
            setting     : setting[0],
            library     : library,
            title       : title,
            user        : newUser,
            alert       : message.success(),
          })
        })
      })
      .catch(function(err) {
        callback({
          content     : 'profile',
          setting     : setting[0],
          library     : library,
          title       : title,
          user        : user,
          alert       : message.error(err.message),
        })
      })
    })
  })
}
