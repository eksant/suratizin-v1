const Model       = require('../../models')
const message     = require('../../helpers/message')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Activation'

let objAlert  = null

Router.get('/:token', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findOne({
      where: {
        reset_token   : req.params.token,
        reset_expired : null,
        status        : 0,
      }
    })
    .then(function(user) {
      if (user) {
        let objUser = {
          status      : 1,
          reset_token : null,
        }
        Model.User.update(objUser, {
          where: {
            id: user.id,
          }
        })
        .then(function() {
          res.render('./user/login', {
            title       : title,
            setting     : setting[0],
            user        : user,
            alert       : message.success('Akun Anda sudah aktif, silahkan login untuk update profil Anda'),
          })
          objAlert = null
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect('/user/login')
        })
      } else {
        objAlert = message.error('Token aktivasi tidak sesuai, silahkan untuk melakukan pendaftaran lagi !!')
        res.redirect('/user/login')
      }
    })
  })
})

module.exports = Router;
