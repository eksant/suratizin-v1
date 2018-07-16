const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const template    = require('../../helpers/templateemail')
const send        = require('../../helpers/notification')
const multer      = require('multer')
const kue         = require('kue')
const queue       = kue.createQueue()
const title       = 'Profile Perusahaan/Jasa'

let objCompany = {
  name                : '',
  logo                : '',
  category            : '',
  sub_category        : '',
  description         : '',
  address             : '',
  province            : '',
  city                : '',
  email               : '',
  phone               : '',
  fax                 : '',
  year_establishment  : '',
  total_employes      : '',
  website             : '',
  bank_account_name   : '',
  bank_name           : '',
  bank_branch         : '',
  bank_account_number : '',
  photo_siup          : '',
  photo_valid_bill    : '',
}

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findAll({
      where: {
        UserId: res.locals.userSession.id,
      },
      order: [
        ['name', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: [Model.User],
    })
    .then(function(company) {
      callback({
        content     : 'company',
        setting     : setting[0],
        title       : title,
        action      : '',
        company     : company,
        alert       : null,
      })
    })
  })
}

module.exports.add = function(callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    callback({
      content     : 'company_form',
      setting     : setting[0],
      title       : title,
      action      : 'add',
      company     : objCompany,
      alert       : null,
    })
  })
}

module.exports.create = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Admin.findAll({
      where: {
        role: 1,
      }
    })
    .then(function(admin) {
      Model.User.findById(res.locals.userSession.id)
      .then(function(user) {
        Model.Company.findAll({
          where: {
            UserId    : user.id,
            category  : req.body.category,
          }
        })
        .then(function(isAlreadyCompany) {
          if (isAlreadyCompany.length == 0) {
            let objCompany = {
              UserId              : user.id,
              name                : req.body.name,
              logo                : req.body.logo,
              category            : req.body.category,
              description         : req.body.description || null,
              address             : req.body.address,
              city                : req.body.city,
              email               : req.body.email,
              phone               : req.body.phone,
              fax                 : req.body.fax || null,
              year_establishment  : req.body.year_establishment || null,
              total_employes      : req.body.total_employes || null,
              website             : req.body.website || null,
              bank_account_name   : req.body.bank_account_name,
              bank_name           : req.body.bank_name,
              bank_branch         : req.body.bank_branch || null,
              bank_account_number : req.body.bank_account_number,
              photo_siup          : req.body.photo_siup,
              photo_valid_bill    : req.body.photo_valid_bill,
              validation          : 0,
            }
            Model.Company.create(objCompany)
            .then(function() {
              // send email to admin
              admin.map(data => {
                let objMailAdmin = {
                  to          : data.email,
                  subject     : `[${setting[0].app_name}] Permohonan validasi perusahaan/jasa (${objCompany.name}) dari ${user.name}.`,
                  body        : template.registered_company(setting[0], admin, user, objCompany),
                }
                queue.create('email', objMailAdmin)
                .save(function(err){
                   if( !err ) console.log( err );
                })

                // send.email(objMailAdmin, function(error, info) {
                //   if (error) {
                //     reject(arrMessage.push('Gagal mengirimkan notifikasi email permohonan validasi perusahaan/jasa ke admin'))
                //   }
                //   console.log(`Notifikasi email permohonan validasi perusahaan/jasa telah berhasil dikirim ke ${data.email}`);
                //   resolve(arrMessage.push('Notifikasi email permohonan validasi perusahaan/jasa telah berhasil dikirim ke admin'))
                // })
              })

              // send email to user
              let objMailUser = {
                to          : user.email,
                subject     : `[${setting[0].app_name}] Pendaftaran perusahaan/jasa (${objCompany.name}) menunggu validasi dari admin.`,
                body        : template.registered_company_waiting(setting[0], admin, user, objCompany),
              }
              queue.create('email', objMailUser)
              .save(function(err){
                 if( !err ) console.log( err );
              })

              // send.email(objMailUser, function(error, info) {
              //   if (error) {
              //     reject(arrMessage.push(`Gagal mengirimkan notifikasi email pendaftaran perusahaan/jasa ke ${user.email}`))
              //   }
              //   console.log(`Notifikasi email pendaftaran perusahaan/jasa telah berhasil dikirim ke ${user.email}`);
              //   resolve(arrMessage.push(`Notifikasi email pendaftaran perusahaan/jasa telah berhasil dikirim ke ${user.email}`))
              // })

              callback({
                content     : 'company',
                setting     : setting[0],
                title       : title,
                action      : 'add',
                company     : objCompany,
                alert       : message.success(),
              })
            })
            .catch(function(err) {
              callback({
                content     : 'company_form',
                setting     : setting[0],
                library     : library,
                title       : title,
                action      : 'add',
                company     : objCompany,
                alert       : message.error(err.message),
              })
            })
          } else {
            callback({
              content     : 'company_form',
              setting     : setting[0],
              library     : library,
              title       : title,
              action      : 'add',
              company     : objCompany,
              alert       : message.error('Kategori Perusahaan/Jasa sudah terdaftar !!'),
            })
          }
        })


        // let objCompany = {
        //   UserId              : user.id,
        //   name                : req.body.name,
        //   logo                : req.body.logo,
        //   category            : req.body.category,
        //   description         : req.body.description || null,
        //   address             : req.body.address,
        //   city                : req.body.city,
        //   email               : req.body.email,
        //   phone               : req.body.phone,
        //   fax                 : req.body.fax || null,
        //   year_establishment  : req.body.year_establishment || null,
        //   total_employes      : req.body.total_employes || null,
        //   website             : req.body.website || null,
        //   bank_account_name   : req.body.bank_account_name,
        //   bank_name           : req.body.bank_name,
        //   bank_branch         : req.body.bank_branch || null,
        //   bank_account_number : req.body.bank_account_number,
        //   photo_siup          : req.body.photo_siup,
        //   photo_valid_bill    : req.body.photo_valid_bill,
        //   validation          : 0,
        // }
        //
        // if (objCompany.photo_siup != '' || objCompany.photo_valid_bill != '') {
        //   let arrMessage = []
        //
        //   // send email to admin
        //   let promiseSendEmailAdmin
        //   admin.map(data => {
        //     promiseSendEmailAdmin = new Promise(function(resolve, reject) {
        //       let objMailAdmin = {
        //         to          : data.email,
        //         subject     : `[${setting[0].app_name}] Permohonan validasi perusahaan/jasa (${objCompany.name}) dari ${user.name}.`,
        //         body        : template.registered_company(setting[0], admin, user, objCompany),
        //       }
        //       send.email(objMailAdmin, function(error, info) {
        //         if (error) {
        //           reject(arrMessage.push('Gagal mengirimkan notifikasi email permohonan validasi perusahaan/jasa ke admin'))
        //         }
        //         console.log('Notifikasi email permohonan validasi perusahaan/jasa telah berhasil dikirim ke admin');
        //         resolve(arrMessage.push('Notifikasi email permohonan validasi perusahaan/jasa telah berhasil dikirim ke admin'))
        //       })
        //     })
        //   })
        //
        //   // send email to user
        //   let promiseSendEmailUser = new Promise(function(resolve, reject) {
        //     let objMailUser = {
        //       to          : user.email,
        //       subject     : `[${setting[0].app_name}] Pendaftaran perusahaan/jasa (${objCompany.name}) menunggu validasi dari admin.`,
        //       body        : template.registered_company_waiting(setting[0], admin, user, objCompany),
        //     }
        //     send.email(objMailUser, function(error, info) {
        //       if (error) {
        //         reject(arrMessage.push(`Gagal mengirimkan notifikasi email pendaftaran perusahaan/jasa ke ${user.email}`))
        //       }
        //       console.log(`Notifikasi email pendaftaran perusahaan/jasa telah berhasil dikirim ke ${user.email}`);
        //       resolve(arrMessage.push(`Notifikasi email pendaftaran perusahaan/jasa telah berhasil dikirim ke ${user.email}`))
        //     })
        //   })
        //
        //   // insert data company
        //   let promiseCreateCompany = new Promise(function(resolve, reject) {
        //     Model.Company.create(objCompany)
        //     .then(function() {
        //       resolve(arrMessage.push('The record has been successfully updated.'))
        //     })
        //     .catch(function(err) {
        //       reject(err)
        //     })
        //   })
        //
        //   Promise.all([promiseSendEmailAdmin, promiseSendEmailUser, promiseCreateCompany])
        //   .then(function() {
        //     callback({
        //       content     : 'company',
        //       setting     : setting[0],
        //       title       : title,
        //       action      : 'add',
        //       company     : objCompany,
        //       alert       : message.success(arrMessage),
        //     })
        //   })
        //   .catch(function(err) {
        //     callback({
        //       content     : 'company_form',
        //       setting     : setting[0],
        //       title       : title,
        //       action      : 'add',
        //       company     : objCompany,
        //       alert       : message.error(err.message),
        //     })
        //   })
        // } else {
        //   callback({
        //     content     : 'company_form',
        //     setting     : setting[0],
        //     library     : library,
        //     title       : title,
        //     action      : 'add',
        //     company     : objCompany,
        //     alert       : message.error('Photo NPWP dan Tagihan Listrik/Telp yang sesuai dengan alamat perusahaan/jasa wajib di upload !!'),
        //   })
        // }
      })
    })
  })
}

module.exports.edit = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findById(req.params.id)
    .then(function(company) {
      callback({
        content     : 'company_form',
        setting     : setting[0],
        title       : title,
        action      : 'edit',
        company     : company,
        alert       : null,
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findById(req.params.id)
    .then(function(company) {
      let uploadLogo = req.body.logo
      let uploadSiup = req.body.photo_siup
      let uploadBill = req.body.photo_valid_bill

      if (uploadLogo == '') {
        uploadLogo = company.logo
      }
      if (uploadSiup == '') {
        uploadSiup = company.photo_siup
      }
      if (uploadBill == '') {
        uploadBill = company.photo_valid_bill
      }

      let objCompany = {
        id                  : req.params.id,
        name                : req.body.name,
        logo                : uploadLogo,
        category            : req.body.category,
        description         : req.body.description,
        address             : req.body.address,
        city                : req.body.city,
        email               : req.body.email,
        phone               : req.body.phone,
        fax                 : req.body.fax,
        year_establishment  : req.body.year_establishment,
        total_employes      : req.body.total_employes,
        website             : req.body.website,
        bank_account_name   : req.body.bank_account_name,
        bank_name           : req.body.bank_name,
        bank_branch         : req.body.bank_branch,
        bank_account_number : req.body.bank_account_number,
        photo_siup          : uploadSiup,
        photo_valid_bill    : uploadBill,
        validation          : 0,
      }
      Model.Company.update(objCompany, {
        where: {
          id: req.params.id,
        },
      })
      .then(function() {
        callback({
          content     : 'company',
          setting     : setting[0],
          title       : title,
          action      : 'edit',
          company     : objCompany,
          alert       : message.success(),
        })
      })
      .catch(function(err) {
        callback({
          content     : 'company_form',
          setting     : setting[0],
          title       : title,
          action      : 'edit',
          company     : objCompany,
          alert       : message.error(err),
        })
      })
    })
  })
}

module.exports.delete = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.destroy({
      where: {
        id: req.params.id,
      }
    })
    .then(function() {
      callback({
        content     : 'company',
        setting     : setting[0],
        title       : title,
        alert       : message.success(),
      })
    })
  })
}
