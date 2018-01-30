const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const multer      = require('multer')
const Op          = require('sequelize').Op
const title       = 'Permohonan Perizinan'

let objRequest = {
  UserId          : '',
  title           : 'Permohonan Izin Bangunan Gedung IT',
  location_city   : 'Jakarta Selatan',
  attachment      : '',
  needed_date     : '02/10/2018',
  remark          : 'Mohon dikirimkan proposal penawaran perizinan IMB untuk Jakarta Selatan. Terima kasih',
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
      library     : library,
      alert       : null,
    })
  })
}

module.exports.create = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findAll({
      where: {
        [Op.or] : [{role: 2}, {role: 3}],
      },
      include: [{
        model: Model.Company,
        where: {
          category: req.body.category,
          validation: 1,
        }
      }],
    })
    .then(function(mitras) {
      // callback(mitras)
      let objRequest = {
        UserId          : res.locals.userSession.id,
        category        : req.body.category,
        title           : req.body.title,
        location_city   : req.body.location_city,
        attachment      : req.body.attachment,
        needed_date     : req.body.needed_date,
        remark          : req.body.remark,
        status          : 0,
      }

      let promiseSendMitra
      let promiseSendCompany
      let arrMessageEmail = []
      let successSend     = 0
      let failSend        = 0
      let arr = mitras.map(mitra => {
        if (mitra.email) {
          // console.log(mitra.email);
          promiseSendMitra = new Promise(function(resolve, reject) {
            let objMailMitra = {
              to          : mitra.email,
              subject     : `[${setting[0].app_name}] ${objRequest.title}.`,
              body        : '',
            }
            send.email(objMailMitra, function(error, info) {
              if (!error) {
                successSend++
                console.log(`Notifikasi email permohonan telah berhasil dikirim ke ${mitra.email}`);
                arrMessageEmail.push(`Notifikasi email permohonan telah berhasil dikirim ke ${mitra.email}`)
                resolve()
              } else {
                failSend++
                console.log(`Gagal mengirimkan notifikasi email permohonan ke ${mitra.email}`);
                arrMessageEmail.push(`Gagal mengirimkan notifikasi email permohonan ke ${mitra.email}`)
                reject()
              }
            })
          })
        }
        mitra.Companies.map(company => {
          if (company.email) {
            // console.log(company.email);
            promiseSendCompany = new Promise(function(resolve, reject) {
              let objMailCompany = {
                to          : company.email,
                subject     : `[${setting[0].app_name}] ${objRequest.title}.`,
                body        : '',
              }
              send.email(objMailCompany, function(error, info) {
                if (!error) {
                  successSend++
                  console.log(`Notifikasi email permohonan telah berhasil dikirim ke ${company.email}`);
                  arrMessageEmail.push(`Notifikasi email permohonan telah berhasil dikirim ke ${company.email}`)
                  resolve()
                }else{
                  failSend++
                  console.log(`Gagal mengirimkan notifikasi email permohonan ke ${company.email}`);
                  arrMessageEmail.push(`Gagal mengirimkan notifikasi email permohonan ke ${company.email}`)
                  reject()
                }
              })
            })
          }
        })
        return mitra
      })

      let promiseCreateRequest = new Promise(function(resolve, reject) {
        Model.Request.create(objRequest)
        .then(function() {
          arrMessageEmail.push(`The record has been successfully updated.`)
          resolve()
        })
        .catch(function(err) {
          arrMessageEmail.push(`The record fail to updated.`)
          reject()
        })
      })

      Promise.all([promiseSendMitra, promiseSendCompany, promiseCreateRequest])
      .then(function(result) {
        // callback(arrMessageEmail)
        callback({
          content     : 'request',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          request     : objRequest,
          alert       : message.success(),
        })
      })
      .catch(function(err) {
        // callback(null)
        callback({
          content     : 'request_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          request     : objRequest,
          library     : library,
          alert       : message.error(err),
        })
      })
    })
  })
}

module.exports.edit = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.findById(req.params.id)
    .then(function(request) {
      callback({
        content     : 'request_form',
        setting     : setting[0],
        title       : title,
        action      : 'edit',
        request     : request,
        library     : library,
        alert       : null,
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findAll({
      where: {
        [Op.or] : [{role: 2}, {role: 3}],
      },
      include: [{
        model: Model.Company,
        where: {
          category: req.body.category,
          validation: 1,
        }
      }],
    })
    .then(function(mitras) {
      let objRequest = {
        id              : req.params.id,
        UserId          : res.locals.userSession.id,
        category        : req.body.category,
        title           : req.body.title,
        location_city   : req.body.location_city,
        attachment      : req.body.attachment,
        needed_date     : req.body.needed_date,
        remark          : req.body.remark,
      }
      Model.Request.update(objRequest, {
        where: {
          id: req.params.id,
        },
      })
      .then(function() {
        callback({
          content     : 'request',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          request     : objRequest,
          alert       : message.success(),
        })
      })
      .catch(function(err) {
        callback({
          content     : 'request_form',
          setting     : setting[0],
          title       : title,
          action      : 'add',
          request     : objRequest,
          library     : library,
          alert       : message.error(err),
        })
      })
    })
  })
}

module.exports.delete = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Request.destroy({
      where: {
        id: req.params.id,
      }
    })
    .then(function() {
      callback({
        content     : 'request',
        setting     : setting[0],
        title       : title,
        alert       : message.success(),
      })
    })
  })
}
