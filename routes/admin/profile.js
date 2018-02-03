const Model = require("../../models");
const message = require("../../helpers/message");
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
const template = require("../../helpers/library");
const multer      = require('multer')
const send        = require('../../helpers/notification')
let objAlert = null;

function profileGet(req, res) {
  Model.Setting.findAll().then(function(setting) {
    Model.Admin.findById(req.session.user.id).then(function(admin) {
      res.render("./admin", {
        title: "Profile",
        content: "profile",
        action: "",
        admin: admin,
        setting: setting[0],
        new_button: true,
        alert: objAlert,
        library: library
      });
      objAlert = null
    })
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin/user");
  });
}
function uploadPost(req, res) {
  Model.Admin.findOne({
    where: {id: req.session.user.id},
  })
  .then(function(admin) {
    const fileName = 'photo_' + Date.now() + '_'
    const Storage = multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, "./public/uploads/profile/");
      },
      filename: function(req, file, callback) {
        callback(null, fileName + file.originalname.split(' ').join('_').toLowerCase());
      }
    });

    var upload = multer({ storage: Storage }).single('photo_profile')
    upload(req, res, function(err) {
      if (!err) {
        let objProfile = {
          photo     : fileName + req.file.originalname.split(' ').join('_').toLowerCase(),
          updatedAt : new Date(),
        }
        Model.Admin.update(objProfile, {
          where: {
            id: admin.id,
          }
        })
        .then(function() {
          req.session.user.photo   = objProfile.photo
          objAlert = message.success()
          res.redirect(`/admin/profile`)
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect(`/admin/profile`)
        })
      } else {
        objAlert = message.error(err.message)
        res.redirect(`/admin/profile`)
      }
    })
  })
}

function profilePost(req, res) {
  if (req.body.new_password != '') {
    if (req.body.new_password != req.body.new_password_repeat) {
      objAlert = message.error('Incorrect your repeat new password !!')
      res.redirect(`/admin/profile`)
    }
  }

  var hooks = true
  if (req.body.new_password == '') {
    hooks = false
    var objAdmin = {
      name          : req.body.name,
      gender        : req.body.gender,
      handphone     : req.body.handphone,
      address       : req.body.address,
      updatedAt     : new Date(),
    }
  } else {
    var objAdmin = {
      name          : req.body.name,
      gender        : req.body.gender,
      handphone     : req.body.handphone,
      address       : req.body.address,
      password      : req.body.new_password,
      updatedAt     : new Date(),
    }
  }
  Model.Admin.update(objAdmin, {
    where: {
      id: req.session.user.id,
    },
    individualHooks: hooks,
  })
  .then(function() {
    if(hooks){
      objAlert = message.success()
      res.redirect(`/admin/auth/login?newPass=true`)
    }else{
      objAlert = message.success()
      res.redirect(`/admin/profile`)
    }
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect(`/admin/profile`)
  })
}
module.exports = {
  profileGet,
  profilePost,
  uploadPost,
};
