const message     = require('../../helpers/message')
const home        = require('./home')
const profile     = require('./profile')
const company     = require('./company')
const multer      = require('multer')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'User'
const rootpath    = './user/index'

let objAlert  = null

Router.get('/logout', (req, res) => {
  req.session.isLogin    = false
  req.session.destroy((err) => {
    if (!err) {
      res.locals.user        = null
      res.locals.userSession = null
      res.redirect('/')
    }
  })
})

Router.get('/delete', (req, res) => {
  home.delete(res.locals.userSession.id, data => {
    res.redirect('/user/login')
  })
})

Router.get('/', (req, res) => {
  home.get(res.locals.userSession.id, data => {
    if (data) {
      res.render(rootpath, data)
    } else {
      res.redirect('/user/login')
    }
  })
})

Router.get('/profile', (req, res) => {
  profile.get(res.locals.userSession.id, data => {
    res.render(rootpath, data)
  })
})

Router.post('/profile/edit', (req, res) => {
  let objUser = {
    id                  : res.locals.userSession.id,
    name                : req.body.name,
    gender              : req.body.gender,
    handphone           : req.body.handphone,
    address             : req.body.address,
    new_password        : req.body.new_password,
    new_password_repeat : req.body.new_password_repeat,
  }
  profile.post(objUser, data => {
    req.session.user       = data.user
    res.locals.userSession = req.session.user
    res.render(rootpath, data)
  })
})

Router.post('/profile/upload', (req, res) => {
  const fileName = 'profile_' + Date.now() + '_'
  let oriName  = ''
  let Storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, "./public/uploads/profile/");
    },
    filename: function(req, file, callback) {
      oriName = file.originalname.split(' ').join('_').toLowerCase()
      callback(null, fileName + oriName);
    }
  });

  let upload = multer({ storage: Storage }).single('photo_profile')
  upload(req, res, function(err) {
    if (!err) {
      let objUser = {
        id    : res.locals.userSession.id,
        photo : fileName + oriName,
      }
      profile.upload(objUser, data => {
        req.session.user       = data.user
        res.locals.userSession = req.session.user
        res.render(rootpath, data)
      })
    } else {
      objAlert = message.error(err.message)
      res.redirect('/user/profile')
    }
  })
})

Router.get('/company', (req, res) => {
  company.read(res.locals.userSession.id, data => {
    res.render(rootpath, data)
  })
})

Router.get('/company/add', (req, res) => {
  company.add(data => {
    res.render(rootpath, data)
  })
})

module.exports = Router;
