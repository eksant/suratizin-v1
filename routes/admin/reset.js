const Model = require("../../models");
const message = require("../../helpers/message");
const library = require("../../helpers/library");
const express = require("express");
const Sequelize = require("sequelize");
const Router = express.Router();
const title = "Reset Password";
let message_login = null;
let alert=null
Router.get("/:token", (req, res) => {
  Model.Setting.findAll().then(function(setting) {
    Model.Admin.findOne({
      where: {
        reset_token: req.params.token
      }
    }).then(function(admin) {
      if (admin) {
        if (admin.reset_expired >= Date.now()) {
          res.render("./admin/reset", {
            title: "Reset",
            setting: setting[0],
            admin: admin,
            message_login,
            userSession: req.session.user,
            alert: "success"
          });
          message_login = null;
        } else {
          res.render("./admin/login", {
            title: "Login",
            setting: setting[0],
            admin: null,
            message_login:
              "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!",
            userSession: req.session.user,
            alert: "danger"
          });
          message_login = null;
        }
      } else {
        res.render("./admin/login", {
          title: "Login",
          setting: setting[0],
          admin: null,
          message_login:
            "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!",
          userSession: req.session.user,
          alert: "danger"
        });
        message_login = null;
      }
    });
  });
});

Router.post("/:token", (req, res) => {
  if (req.body.password != req.body.retype_password) {
    message_login = "Verifikasi password tidak sesuai dengan password !!";
    alert = 'danger'
    res.redirect(`/admin/reset/${req.params.token}`);
  } else {
    Model.Admin.findOne({
      where: {
        reset_token: req.params.token
      }
    }).then(function(admin) {
      Model.Setting.findAll().then(function(setting) {
        if (admin) {
          if (admin.reset_expired >= Date.now()) {
            let objUser = {
              password: req.body.password,
              reset_token: null,
              reset_expired: null,
              updatedAt: new Date()
            };
            Model.Admin.update(objUser, {
              where: {
                id: admin.id
              }
            })
              .then(function() {
                res.render("./admin/login", {
                  title: "Login",
                  setting: setting[0],
                  admin: null,
                  message_login:
                    "Reset password telah berhasil, silahkan melakukan login !!",
                  userSession: req.session.user,
                  alert: "success"
                });
                message_login = null;
              })
              .catch(function(err) {
                res.render("./admin/reset", {
                  title: "Reset",
                  setting: setting[0],
                  admin: admin,
                  message_login: err.message,
                  userSession: req.session.user,
                  alert: "danger"
                });
                message_login = null;
              });
          } else {
            res.render("./admin/login", {
              title: "Login",
              setting: setting[0],
              admin: null,
              message_login:
                "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!",
              userSession: req.session.user,
              alert: "danger"
            });
            message_login = null;
          }
        } else {
          res.render("./admin/login", {
            title: "Login",
            setting: setting[0],
            admin: null,
            message_login:
              "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!",
            userSession: req.session.user,
            alert: "danger"
          });
          message_login = null;
        }
      });
    });
  }
});
Router.get("*",(req,res)=>{
  res.redirect('/admin')
})

module.exports = Router;
