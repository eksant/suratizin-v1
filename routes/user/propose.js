const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const getCategory = require('../../helpers/getCategory')
const multer      = require('multer')
const kue         = require('kue')
const queue       = kue.createQueue()
const Op          = require('sequelize').Op
const title       = 'Penawaran Jasa'

let objPropose = {
  CompanyId     : '',
  UserId        : '',
  RequestId     : '',
  price         : '',
  negotiable    : '',
  attachment    : '',
  info_partner  : '',
  status        : '',
}

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {

      Model.Propose.findAll({
        where: {
          status: { [Op.ne]: 2, },
        },
        order: [
          ['RequestId', 'ASC'],
          ['createdAt', 'ASC'],
        ],
        include: [{
          model: Model.Company,
          where: {
            UserId: res.locals.userSession.id,
          }
        }, {
          model: Model.User,
          // where: {
          //   id: res.locals.userSession.id,
          // }
        }, {
          model: Model.Request,
        }],
      })
      .then(function(propose) {
        // callback(propose)
        callback({
          content     : 'propose',
          setting     : setting[0],
          title       : title,
          action      : '',
          propose     : propose,
          alert       : null,
        })
      })

  })
}

module.exports.add = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.findOne({
      where : {
        id: req.params.id,
      },
      include: [Model.User],
    })
    .then(function(request) {
      Model.Company.findOne({
        where: {
          category  : request.category,
          UserId    : res.locals.userSession.id,
        }
      })
      .then(function(company) {
        callback({
          content     : 'propose_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          request     : request,
          company     : company,
          propose     : objPropose,
          library     : library,
          alert       : null,
        })
      })
    })
  })
}

module.exports.create = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.findOne({
      where : {
        id: req.params.id,
      },
      include: [Model.User],
    })
    .then(function(request) {
      Model.Company.findOne({
        where: {
          category  : request.category,
          UserId    : res.locals.userSession.id,
        }
      })
      .then(function(company) {
        objPropose = {
          CompanyId     : company.id,
          UserId        : request.UserId,
          RequestId     : request.id,
          price         : req.body.price,
          info_partner  : req.body.info_partner,
          status        : 0,
        }

        // callback(objPropose)
        Model.Propose.create(objPropose)
        .then(function() {
          callback({
            content     : 'propose',
            setting     : setting[0],
            title       : title,
            action      : '',
            request     : request,
            company     : company,
            propose     : objPropose,
            library     : library,
            alert       : message.success(),
          })
        })
        .catch(function(err) {
          callback({
            content     : 'propose_form',
            setting     : setting[0],
            title       : title,
            action      : 'add',
            request     : request,
            company     : company,
            propose     : objPropose,
            library     : library,
            alert       : message.error(err.message),
          })
        })
      })
    })
  })
}

module.exports.edit = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Propose.findById(req.params.propose_id)
    .then(function(propose) {
      Model.Request.findOne({
        where : {
          id: propose.RequestId,
        },
        include: [Model.User],
      })
      .then(function(request) {
        Model.Company.findOne({
          where: {
            category  : request.category,
            UserId    : res.locals.userSession.id,
          }
        })
        .then(function(company) {
          callback({
            content     : 'propose_form',
            setting     : setting[0],
            title       : title,
            action      : 'edit',
            request     : request,
            company     : company,
            propose     : propose,
            library     : library,
            alert       : null,
          })
        })
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.findOne({
      where : {
        id: req.params.id,
      },
      include: [Model.User],
    })
    .then(function(request) {
      Model.Company.findOne({
        where: {
          category  : request.category,
          UserId    : res.locals.userSession.id,
        }
      })
      .then(function(company) {
        objPropose = {
          CompanyId     : company.id,
          UserId        : request.UserId,
          RequestId     : request.id,
          price         : req.body.price,
          info_partner  : req.body.info_partner,
          status        : 0,
        }

        // callback(objPropose)
        Model.Propose.update(objPropose, {
          where: {
            id: req.params.propose_id,
          }
        })
        .then(function() {
          callback({
            content     : 'propose',
            setting     : setting[0],
            title       : title,
            action      : '',
            request     : request,
            company     : company,
            propose     : objPropose,
            library     : library,
            alert       : message.success(),
          })
        })
        .catch(function(err) {
          callback({
            content     : 'propose_form',
            setting     : setting[0],
            title       : title,
            action      : 'edit',
            request     : request,
            company     : company,
            propose     : objPropose,
            library     : library,
            alert       : message.error(err.message),
          })
        })
      })
    })
  })
}

module.exports.delete = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Propose.destroy({
      where: {
        id: req.params.propose_id,
      }
    })
    .then(function() {
      callback({
        content     : 'propose',
        setting     : setting[0],
        title       : title,
        alert       : message.success(),
      })
    })
  })
}
