const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Login'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('./user/login', {
      title       : title,
      setting     : setting[0],
      user        : null,
      alert       : objAlert,
      library     : library,
    })
    objAlert = null
  })
})

Router.post('/verification', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findOne({
      where: {
        email: req.body.email,
      }
    })
    .then((user) => {
      if (user == null) {
        res.render('./user/login', {
          title       : title,
          setting     : setting[0],
          user        : user,
          alert       : message.error('Username atau Password tidak sesuai !!'),
        })
        objAlert = null
      } else {
        user.check_password(req.body.password, (isMatch) => {
          if (isMatch) {
            req.session.isLogin    = true
            req.session.user       = user
            // res.locals.userSession = req.session.user
            // let objLog = {
            //   UserId      : user.id,
            //   username    : user.username,
            //   ip_address  : getClientIp(req),
            //   last_login  : Date.now(),
            //   status      : 'success',
            // }
            // Model.Log.create(objLog)
            res.redirect('/user')
          } else {
            req.session.isLogin    = false
            req.session.user       = null
            res.locals.userSession = null
            // let objLog = {
            //   UserId      : user.id,
            //   username    : user.username,
            //   ip_address  : getClientIp(req),
            //   last_login  : Date.now(),
            //   status      : 'danger',
            //   information : message_login,
            // }
            // Model.Log.create(objLog)
            res.render('./user/login', {
              title       : title,
              setting     : setting[0],
              user        : null,
              alert       : message.error('Username atau Password tidak sesuai !!'),
            })
            objAlert = null
          }
        })
      }
    })
    .catch((err) => {
      res.render('./user/login', {
        title       : title,
        setting     : setting[0],
        user        : null,
        alert       : message.error(err.message),
      })
      objAlert = null
    })
  })
})

module.exports = Router;
