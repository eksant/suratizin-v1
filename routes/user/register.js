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
const title       = 'Register'

Router.post('/', (req, res) => {
  if (req.body.password != req.body.retype_password) {
    objAlert = message.error('Verifikasi password tidak sesuai dengan password !!')
    res.redirect('/login')
  } else {
    Model.Setting.findAll()
    .then(function(setting) {
      let info    = ''
      let token   = library.randomValueBase64(64)
      let link    = req.headers.host + '/user/activation/' + token
      let objUser = {
        name          : req.body.name,
        email         : req.body.email,
        password      : req.body.password,
        role          : req.body.role,
        reset_token   : token,
        reset_expired : null,
        status        : 0,
      }
      Model.User.create(objUser)
      .then(function() {
        Model.User.findOne({
          where: {
            email   : req.body.email,
            role    : req.body.role,
            status  : 0,
          }
        })
        .then(function(user) {
          let objMail = {
            to          : req.body.email,
            subject     : `[${setting[0].app_name}] Selamat ${req.body.name}, Akun Anda telah berhasil di daftarkan.`,
            body        : template.registered_success(setting[0], objUser, link),
          }
          queue.create('email', objMail)
          .save(function(err){
             if (!err) {
               res.render('./user/login', {
                 title       : title,
                 setting     : setting[0],
                 user        : user,
                 alert       : message.success(`Selamat ${user.name}. Aktifasi akun telah dikirim ke email ${req.body.email}`),
               })
             } else {
               res.render('./user/login', {
                 title       : title,
                 setting     : setting[0],
                 user        : null,
                 alert       : message.error('Gagal untuk pendaftaran akun !!'),
               })
             }
          })


          // send.email(objMail, function(error, info) {
          //   if (!error) {
          //     info = `Aktifasi akun telah dikirim ke email ${req.body.email}\n`
          //     info += 'The record has been successfully updated.'
          //     res.render('./user/login', {
          //       title       : title,
          //       setting     : setting[0],
          //       user        : user,
          //       alert       : message.success(`Selamat ${user.name}. Aktifasi akun telah dikirim ke email ${req.body.email}`),
          //       library     : library,
          //     })
          //   } else {
          //     res.render('./user/login', {
          //       title       : title,
          //       setting     : setting[0],
          //       user        : user,
          //       alert       : message.error('Gagal untuk mengirimkan aktifkasi akun !!'),
          //       library     : library,
          //     })
          //   }
          // })
        })
      })
      .catch(function(err) {
        res.render('./user/login', {
          title       : title,
          setting     : setting[0],
          user        : null,
          alert       : message.error(err.message),
        })
      })


      // GA PAKE PROMISE-PROMISE'AN
      // let promiseSendEmail = new Promise(function(resolve, reject) {
      //   let objMail = {
      //     to          : req.body.email,
      //     subject     : `[${setting[0].app_name}] Selamat ${req.body.name}, Akun Anda telah berhasil di daftarkan.`,
      //     body        : template.registered_success(setting[0], objUser, link),
      //   }
      //   send.email(objMail, function(error, info) {
      //     if (!error) {
      //       info = `Aktifasi akun telah dikirim ke email ${req.body.email}`
      //       console.log(info);
      //       resolve(info)
      //     } else {
      //       info = 'Gagal untuk mengirimkan aktifkasi akun !!'
      //       console.log(error);
      //       reject(error)
      //     }
      //   })
      // })

      // let promiseCreateUser = new Promise(function(resolve, reject) {
      //   Model.User.create(objUser)
      //   .then(function() {
      //     info = 'The record has been successfully updated.'
      //     resolve(info)
      //   })
      //   .catch(function(err) {
      //     info = err.message
      //     reject(info)
      //   })
      // })

      // Promise.all([promiseSendEmail, promiseCreateUser])
      // .then(function() {
      //   Model.User.findOne({
      //     where: {
      //       email   : req.body.email,
      //       role    : req.body.role,
      //       status  : 0,
      //     }
      //   })
      //   .then(function(user) {
      //     // objAlert = message.success(info)
      //     // res.redirect(`/user/login/${user.id}`)
      //     res.render('./user/login', {
      //       title       : title,
      //       setting     : setting[0],
      //       user        : user,
      //       alert       : message.success(),
      //       library     : library,
      //     })
      //   })
      // })
      // .catch(function(err) {
      //   res.render('./login', {
      //     title       : title,
      //     setting     : setting[0],
      //     user        : null,
      //     alert       : message.error(err.message),
      //   })
      //   objAlert = null
      // })
    })
  }
})

module.exports = Router;
