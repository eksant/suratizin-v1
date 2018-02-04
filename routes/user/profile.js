const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Edit Profile'

module.exports.read = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id).then(function(user) {
    Model.Province.findAll().then(provinces=>{
      Model.Regency.findAll().then(regencies=>{

        let regency = regencies.filter(e=>{
          return e.name==user.address.split(',')[user.address.split(',').length-2].trim()
        })[0]
        let province = provinces.filter(e=>{
          return e.name==user.address.split(',')[user.address.split(',').length-1].trim()
        })[0]
        user.address= user.address.split(',').splice(0,user.address.split(',').length-2).join(' ')

          callback({
            content     : 'profile_form',
            setting     : setting[0],
            title       : title,
            user        : user,
            alert       : null,
            province,
            regency,
            provinces,
            regencies,
          })
        })
      })
    })
  })
}

module.exports.update = function(req, res, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(res.locals.userSession.id)
    .then(function(user) {
      Model.Province.findAll().then(provinces=>{
        Model.Regency.findAll().then(regencies=>{
          let uploadPhoto = req.body.photo
          if (uploadPhoto == '') {
            uploadPhoto = user.photo
          }
          let objUser = {
            id                  : res.locals.userSession.id,
            name                : req.body.name,
            gender              : req.body.gender,
            handphone           : req.body.handphone,
            address             : req.body.address,
            photo               : uploadPhoto,
            password            : req.body.password,
            new_password_repeat : req.body.new_password_repeat,
          }
          let regency = regencies.filter(e=>{
            return e.codeRegency==req.body.regency
          })[0]

          let province = provinces.filter(e=>{
            return e.codeProvince==req.body.province
          })[0]

          if (objUser.password != objUser.new_password_repeat) {
            callback({
              content     : 'profile_form',
              setting     : setting[0],
              title       : title,
              user        : objUser,
              alert       : message.error('Password baru tidak sesuai dengan password yang di ulangi !!'),
              provinces,
              regencies,
              province,
              regency,
            })
          } else {
            var hooks = true
            delete objUser.new_password_repeat
            objUser.updatedAt = new Date()

            if (objUser.password == '') {
              hooks = false
              delete objUser.password
            }

            objUser.address = `${req.body.address.trim()} , ${regency.name} , ${province.name}`
            objUser.latitude = `${req.body.latitude}`
            objUser.longitude = `${req.body.longitude}`
            objUser.addressMaps = `${req.body.locality}`
            Model.User.update(objUser, {
              where: {
                id: objUser.id,
              },
              individualHooks: hooks,
            })
            .then(function() {
              Model.User.findById(objUser.id)
              .then(function(newUser) {
                newUser.address = newUser.address.split(',').splice(0,user.address.split(',').length-2).join(' ')
                req.session.user       = newUser
                res.locals.userSession = req.session.user
                callback({
                  content     : 'profile_form',
                  setting     : setting[0],
                  title       : title,
                  user        : newUser,
                  alert       : message.success(),
                  provinces,
                  regencies,
                  province,
                  regency,
                })
              })
            })
            .catch(function(err) {
              console.log(err);
              callback({
                content     : 'profile_form',
                setting     : setting[0],
                title       : title,
                user        : objUser,
                alert       : message.error(err.message),
                provinces,
                regencies,
                province,
                regency,
              })
            })
          }
        })
      })
    })
  })
}
