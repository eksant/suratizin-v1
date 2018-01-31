const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const express     = require('express')
const Sequelize   = require('sequelize')
const kue         = require('kue')
const queue       = kue.createQueue()
const Router      = express.Router()
const title       = 'Forgot'

Router.post('/', (req, res) => {
  Model.User.findOne({
    where: {
      email: req.body.email,
    }
  })
  .then(function(user) {
    Model.Setting.findAll()
    .then(function(setting) {
      if (user) {
        let info  = ''
        let token = library.randomValueBase64(64)
        let link  = req.headers.host + '/user/reset/' + token
        let objUser = {
          reset_token   : token,
          reset_expired : Date.now() + 3600000,
        }
        Model.User.update(objUser, {
          where: {
            id: user.id,
          }
        })
        .then(function() {
          let objMail = {
            to          : req.body.email,
            subject     : `[${setting[0].app_name}] Permintaan reset password.`,
            body        : template.reset_password(user, link),
          }
          queue.create('email', objMail)
          .save(function(err){
             if( !err ) console.log( err );
          })

          res.render('./user/login', {
            title       : 'Login',
            setting     : setting[0],
            user        : null,
            alert       : message.success(`Reset password telah dikirim ke email ${user.email}`),
          })
          objAlert = null
        })
        .catch(function(err) {
          res.render('./user/login', {
            title       : 'Login',
            setting     : setting[0],
            user        : null,
            alert       : message.error(err.message),
          })
          objAlert = null
        })

        // let promiseSendEmail = new Promise(function(resolve, reject) {
        //   let objMail = {
        //     to          : req.body.email,
        //     subject     : `[${setting[0].app_name}] Permintaan reset password.`,
        //     body        : template.reset_password(user, link),
        //   }
        //
        //   send.email(objMail, function(error, info) {
        //     if (!error) {
        //       info = `Reset password telah dikirim ke email ${user.email}`
        //       console.log(info);
        //       resolve(info)
        //     } else {
        //       info = 'Gagal untuk mengirimkan reset password !!'
        //       console.log(error);
        //       reject(error)
        //     }
        //   })
        // })
        //
        // let promiseUpdateUser = new Promise(function(resolve, reject) {
        //   Model.User.update(objUser, {
        //     where: {
        //       id: user.id,
        //     }
        //   })
        //   .then(function() {
        //     info = 'The record has been successfully updated.'
        //     resolve(info)
        //   })
        //   .catch(function(err) {
        //     info = err.message
        //     reject(info)
        //   })
        // })
        //
        // Promise.all([promiseSendEmail, promiseUpdateUser])
        // .then(function() {
        //   res.render('./user/login', {
        //     title       : 'Login',
        //     setting     : setting[0],
        //     user        : null,
        //     alert       : message.success(`Reset password telah dikirim ke email ${user.email}`),
        //   })
        //   objAlert = null
        // })
        // .catch(function(err) {
        //   res.render('./user/login', {
        //     title       : 'Login',
        //     setting     : setting[0],
        //     user        : null,
        //     alert       : message.error(err.message),
        //   })
        //   objAlert = null
        // })
      } else {
        res.render('./user/login', {
          title       : 'Login',
          setting     : setting[0],
          user        : null,
          alert       : message.error('Email tidak terdaftar, silahkan lakukan pendaftaran !!'),
        })
        objAlert = null
      }
    })
  })
})

module.exports = Router;
