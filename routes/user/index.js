const message     = require('../../helpers/message')
const home        = require('./home')
const profile     = require('./profile')
const company     = require('./company')
const request     = require('./request')
const multer      = require('multer')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'User'
const rootpath    = './user/index'

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

// home
Router.get('/', (req, res) => {
  home.read(req, res, content => {
    if (content) {
      res.render(rootpath, content)
    } else {
      res.redirect('/user/login')
    }
  })
})

Router.get('/delete', (req, res) => {
  home.delete(req, res, content => {
    res.redirect('/user/login')
  })
})

// profile
Router.get('/profile', (req, res) => {
  profile.read(req, res, content => {
    res.render(rootpath, content)
  })
})

let photo = ''
let StorageProfile = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/profile/")
  },
  filename: function(req, file, callback) {
    photo = `${file.fieldname}_${Date.now()}_${file.originalname.split(' ').join('_').toLowerCase()}`
    callback(null, photo)
  }
});
let uploadProfile = multer({ storage: StorageProfile }).single('photo_profile')

Router.post('/profile/edit', uploadProfile, (req, res) => {
  req.body.photo = photo
  profile.update(req, res, content => {
    res.render(rootpath, content)
  })
})

// company
Router.get('/company', (req, res) => {
  company.read(req, res, content => {
    res.render(rootpath, content)
  })
})

Router.get('/company/add', (req, res) => {
  company.add(content => {
    res.render(rootpath, content)
  })
})

let logo              = ''
let photo_siup        = ''
let photo_valid_bill  = ''
let StorageCompany = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/company/")
  },
  filename: function(req, file, callback) {
    if (file.fieldname == 'logo') {
      logo = `${file.fieldname}_${Date.now()}_${file.originalname.split(' ').join('_').toLowerCase()}`
      callback(null, logo)
    } else if (file.fieldname == 'photo_siup') {
      photo_siup = `${file.fieldname}_${Date.now()}_${file.originalname.split(' ').join('_').toLowerCase()}`
      callback(null, photo_siup)
    } else if (file.fieldname == 'photo_bill') {
      photo_valid_bill = `${file.fieldname}_${Date.now()}_${file.originalname.split(' ').join('_').toLowerCase()}`
      callback(null, photo_valid_bill)
    }
  }
});
let uploadCompany = multer({ storage: StorageCompany }).fields([{ name: 'logo', maxCount: 1 }, { name: 'photo_siup', maxCount: 1 }, { name: 'photo_bill', maxCount: 1 }])

Router.post('/company/add', uploadCompany, (req, res) => {
  req.body.logo             = logo
  req.body.photo_siup       = photo_siup
  req.body.photo_valid_bill = photo_valid_bill
  company.create(req, res, content => {
    if (content.alert.type != 'danger') {
      res.redirect('/user/company')
    } else {
      res.render(rootpath, content)
    }
  })
})

Router.get('/company/edit/:id', (req, res) => {
  company.edit(req, res, content => {
    res.render(rootpath, content)
  })
})

Router.post('/company/edit/:id', uploadCompany, (req, res) => {
  req.body.logo             = logo
  req.body.photo_siup       = photo_siup
  req.body.photo_valid_bill = photo_valid_bill
  company.update(req, res, content => {
    if (content.alert.type != 'danger') {
      res.redirect('/user/company')
    } else {
      res.render(rootpath, content)
    }
  })
})

Router.get('/company/delete/:id', (req, res) => {
  company.delete(req, res, content => {
    res.redirect('/user/company')
  })
})


// request
Router.get('/request', (req, res) => {
  request.read(req, res, content => {
    res.render(rootpath, content)
  })
})

Router.get('/request/add', (req, res) => {
  request.add(content => {
    res.render(rootpath, content)
  })
})

let file_attachments  = ''
let StorageRequest = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, "./public/uploads/request/")
  },
  filename: function(req, file, callback) {
    file_attachments = `${res.locals.userSession.name.split(' ').join('_').toLowerCase()}_${Date.now()}_${file.originalname.split(' ').join('_').toLowerCase()}`
    callback(null, file_attachments)
  }
});
let uploadRequest = multer({ storage: StorageRequest }).array('file_attachments', 3)

Router.post('/request/add', uploadRequest, (req, res) => {
  req.body.attachment = file_attachments
  request.create(req, res, content => {
    if (content.alert.type != 'danger') {
      res.redirect('/user/request')
    } else {
      res.render(rootpath, content)
    }
  })
})

Router.get('/request/edit/:id', (req, res) => {
  request.edit(req, res, content => {
    res.render(rootpath, content)
  })
})

Router.post('/request/edit/:id', uploadRequest, (req, res) => {
  req.body.attachment = file_attachments
  request.update(req, res, content => {
    if (content.alert.type != 'danger') {
      res.redirect('/user/request')
    } else {
      res.render(rootpath, content)
    }
  })
})

Router.get('/request/delete/:id', (req, res) => {
  request.delete(req, res, content => {
    res.redirect('/user/request')
  })
})

module.exports = Router;
