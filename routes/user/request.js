const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const multer      = require('multer')
const title       = 'Permohonan Perizinan'

const objRequest = {
  UserId          : '',
  location_city   : '',
  necessities     : '',
  photo_building  : '',
  photo_plan      : '',
  attachment      : '',
  needed_date     : '',
  remark          : '',
  status          : '',
}

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.findAll({
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['category', 'ASC'],
        ['needed_date', 'ASC'],
      ],
      include: [Model.User],
    })
    .then(function(request) {
      callback({
        content     : 'request',
        setting     : setting[0],
        title       : title,
        action      : '',
        request     : request,
        alert       : null,
      })
    })
  })
}

module.exports.add = function(callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    callback({
      content     : 'request_form',
      setting     : setting[0],
      title       : title,
      action      : 'add',
      request     : objRequest,
      alert       : null,
    })
  })
}
