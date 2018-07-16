const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const multer      = require('multer')
const title       = 'Portofolio Perusahaan/Jasa'

let objPortofolio = {
  CompanyId   : '',
  title       : '',
  photo       : '',
  description : '',
}

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Portofolio.findAll({
      order: [
        ['CompanyId', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: [{
        model: Model.Company,
        where: {
          validation: 1,
        }
      }, {
        model: Model.User,
        where: {
          id: res.locals.userSession.id,
        }
      }],
    })
    .then(function(portofolio) {
      callback({
        content     : 'portofolio',
        setting     : setting[0],
        title       : title,
        action      : '',
        portofolio  : portofolio,
        alert       : null,
      })
    })
  })
}

module.exports.add = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findAll({
      where: {
        UserId      : res.locals.userSession.id,
        validation  : 1,
      }
    })
    .then(function(company) {
      callback({
        content     : 'portofolio_form',
        setting     : setting[0],
        title       : title,
        action      : 'add',
        portofolio  : objPortofolio,
        company     : company,
        alert       : null,
      })
    })
  })
}

module.exports.create = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findById(req.body.CompanyId)
    .then(function(company) {
      objPortofolio = {
        CompanyId   : company.id,
        UserId      : res.locals.userSession.id,
        title       : req.body.title,
        photo       : req.body.photo,
        description : req.body.description,
      }
      Model.Portofolio.create(objPortofolio)
      .then(function() {
        callback({
          content     : 'portofolio',
          setting     : setting[0],
          title       : title,
          action      : '',
          portofolio  : objPortofolio,
          alert       : message.success(),
        })
      })
      .catch(function(err) {
        callback({
          content     : 'portofolio_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          portofolio  : objPortofolio,
          alert       : message.error(err.message),
        })
      })
    })
  })
}

module.exports.edit = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Portofolio.findById(req.params.id)
    .then(function(portofolio) {
      Model.Company.findAll({
        where: {
          UserId      : res.locals.userSession.id,
          validation  : 1,
        }
      })
      .then(function(company) {
        callback({
          content     : 'portofolio_form',
          setting     : setting[0],
          title       : title,
          action      : 'edit',
          portofolio  : portofolio,
          company     : company,
          alert       : null,
        })
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    objPortofolio = {
      CompanyId   : req.body.CompanyId,
      UserId      : res.locals.userSession.id,
      title       : req.body.title,
      photo       : req.body.photo,
      description : req.body.description,
    }
    Model.Portofolio.update(objPortofolio, {
      where: {
        id : req.params.id,
      }
    })
    .then(function() {
      callback({
        content     : 'portofolio',
        setting     : setting[0],
        title       : title,
        action      : '',
        portofolio  : objPortofolio,
        alert       : message.success(),
      })
    })
    .catch(function(err) {
      callback({
        content     : 'portofolio_form',
        setting     : setting[0],
        title       : title,
        action      : 'edit',
        portofolio  : objPortofolio,
        alert       : message.error(err.message),
      })
    })
  })
}

module.exports.delete = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Portofolio.destroy({
      where: {
        id: req.params.id,
      }
    })
    .then(function() {
      callback({
        content     : 'portofolio',
        setting     : setting[0],
        title       : title,
        alert       : message.success(),
      })
    })
  })
}
