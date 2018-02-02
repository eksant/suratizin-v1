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
const title       = 'Inbox Penawaran Jasa'

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
    let objFilter
    if (res.locals.userSession.role == 2 || res.locals.userSession.role == 3) {
      objFilter = [{
        model: Model.Company,
        where: {
          UserId: res.locals.userSession.id,
        }
      }, {
        model: Model.User,
      }, {
        model: Model.Request,
      }]
    } else if (res.locals.userSession.role == 4 || res.locals.userSession.role == 5) {
      objFilter = [{
        model: Model.Company,
      }, {
        model: Model.User,
        where: {
          id: res.locals.userSession.id,
        }
      }, {
        model: Model.Request,
      }]
    }
    Model.Propose.findAll({
      where: {
        status: { [Op.ne]: 1, },
      },
      order: [
        ['RequestId', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: objFilter,
    })
    .then(function(propose) {
      // callback(propose)
      callback({
        content     : 'inbox',
        setting     : setting[0],
        title       : title,
        action      : '',
        propose     : propose,
        library     : library,
        alert       : null,
      })
    })
  })
}

module.exports.add = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    let objFilter
    if (res.locals.userSession.role == 2 || res.locals.userSession.role == 3) {
      objFilter = [{
        model: Model.Company,
      }, {
        model: Model.User,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.Request,
      }]
    } else if (res.locals.userSession.role == 4 || res.locals.userSession.role == 5) {
      objFilter = [{
        model: Model.Company,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.User,
      }, {
        model: Model.Request,
      }]
    }
    Model.Propose.findOne({
      where: {
        status: { [Op.ne]: 1, },
      },
      order: [
        ['RequestId', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: objFilter,
    })
    .then(function(propose) {
      // callback(propose)
      callback({
        content     : 'inbox_form',
        setting     : setting[0],
        title       : title,
        action      : 'add',
        propose     : propose,
        library     : library,
        alert       : null,
      })
    })
  })
}

module.exports.create = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    let objFilter
    if (res.locals.userSession.role == 2 || res.locals.userSession.role == 3) {
      objFilter = [{
        model: Model.Company,
      }, {
        model: Model.User,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.Request,
      }]
    } else if (res.locals.userSession.role == 4 || res.locals.userSession.role == 5) {
      objFilter = [{
        model: Model.Company,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.User,
      }, {
        model: Model.Request,
      }]
    }
    Model.Propose.findOne({
      where: {
        status: { [Op.ne]: 1, },
      },
      order: [
        ['RequestId', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: objFilter,
    })
    .then(function(propose) {
      objPropose = {
        CompanyId     : propose.CompanyId,
        UserId        : propose.UserId,
        RequestId     : propose.RequestId,
        info_partner  : req.body.info_partner,
        status        : 2,
      }
      // callback(objPropose)
      Model.Propose.create(objPropose)
      .then(function() {
        callback({
          content     : 'inbox',
          setting     : setting[0],
          title       : title,
          action      : '',
          propose     : propose,
          library     : library,
          alert       : message.success(),
        })
      })
      .catch(function(err) {
        callback({
          content     : 'inbox_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          propose     : objPropose,
          library     : library,
          alert       : message.error(err.message),
        })
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    let objFilter
    if (res.locals.userSession.role == 2 || res.locals.userSession.role == 3) {
      objFilter = [{
        model: Model.Company,
      }, {
        model: Model.User,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.Request,
      }]
    } else if (res.locals.userSession.role == 4 || res.locals.userSession.role == 5) {
      objFilter = [{
        model: Model.Company,
        where: {
          id: req.params.id,
        }
      }, {
        model: Model.User,
      }, {
        model: Model.Request,
      }]
    }
    Model.Propose.findOne({
      where: {
        status: { [Op.ne]: 1, },
      },
      order: [
        ['RequestId', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: objFilter,
    })
    .then(function(propose) {
      objPropose = {
        CompanyId     : propose.CompanyId,
        UserId        : propose.UserId,
        RequestId     : propose.RequestId,
        info_partner  : req.body.info_partner,
        status        : 2,
      }
      // callback(objPropose)
      Model.Propose.create(objPropose)
      .then(function() {
        let objRequest = {
          id      : propose.RequestId,
          status  : 1,
        }
        Model.Request.update(objRequest, {
          where: {
            id: propose.RequestId,
          },
        })
        .then(function() {
          callback({
            content     : 'inbox',
            setting     : setting[0],
            title       : title,
            action      : '',
            propose     : propose,
            library     : library,
            alert       : message.success(),
          })
        })
        .catch(function(err) {
          callback({
            content     : 'inbox_form',
            setting     : setting[0],
            title       : title,
            action      : 'add',
            propose     : objPropose,
            library     : library,
            alert       : message.error(err.message),
          })
        })
      })
      .catch(function(err) {
        callback({
          content     : 'inbox_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          propose     : objPropose,
          library     : library,
          alert       : message.error(err.message),
        })
      })
    })
  })
}
