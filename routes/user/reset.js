const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Reset Password'

let objAlert  = null

Router.get('/:token', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findOne({
      where: {
        reset_token  : req.params.token,
      }
    })
    .then(function(user) {
      if (user) {
        if (user.reset_expired >= Date.now()) {
          res.render('./user/reset', {
            title       : 'Reset',
            setting     : setting[0],
            user        : user,
            alert       : objAlert,
            library     : library,
          })
          objAlert = null
        } else {
          res.render('./user/login', {
            title       : 'Login',
            setting     : setting[0],
            user        : null,
            alert       : message.error('Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!'),
          })
          objAlert = null
        }
      } else {
        res.render('./user/login', {
          title       : 'Login',
          setting     : setting[0],
          user        : null,
          alert       : message.error('Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!'),
        })
        objAlert = null
      }
    })
  })
})

Router.post('/:token/validation', (req, res) => {
  if (req.body.password != req.body.retype_password) {
    objAlert = message.error('Verifikasi password tidak sesuai dengan password !!')
    res.redirect(`/user/reset/${req.params.token}`)
  } else {
    Model.User.findOne({
      where: {
        reset_token  : req.params.token,
      }
    })
    .then(function(user) {
      Model.Setting.findAll()
      .then(function(setting) {
        if (user) {
          if (user.reset_expired >= Date.now()) {
            let objUser = {
              password       : req.body.new_password,
              reset_token    : null,
              reset_expired  : null,
              updatedAt      : new Date(),
            }
            Model.User.update(objUser, {
              where: {
                id: user.id
              },
            })
            .then(function() {
              res.render('./user/login', {
                title       : 'Login',
                setting     : setting[0],
                user        : null,
                alert       : message.success('Reset password telah berhasil, silahkan melakukan login !!'),
              })
              objAlert = null
            })
            .catch(function(err) {
              res.render(`./user/reset/${req.params.token}`, {
                title       : 'Reset',
                setting     : setting[0],
                user        : user,
                alert       : message.error(err.message),
              })
              objAlert = null
            })
          } else {
            res.render(`./user/reset/${req.params.token}`, {
              title       : 'Login',
              setting     : setting[0],
              user        : null,
              alert       : message.error('Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!'),
            })
            objAlert = null
          }
        } else {
          res.render(`./user/reset/${req.params.token}`, {
            title       : 'Login',
            setting     : setting[0],
            user        : null,
            alert       : message.error('Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!'),
          })
          objAlert = null
        }
      })
    })
  }
})

module.exports = Router;
