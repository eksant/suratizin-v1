const Model = require("../../models");
const message = require("../../helpers/message");
const library = require("../../helpers/library");
const template = require("../../helpers/templateemail");
const kue = require("kue");
const queue = kue.createQueue();
const title = "Forgot";
const express = require("express");
const router = express.Router();
let message_login = null;
let alert = null;

router.get("/login", (req, res) => {
  res.render("./admin/login", {
    title: "Admin Home",
    message_login,
    alert
  });
  message_login = null;
  alert = null;
});

router.post("/login", (req, res) => {
  Model.Admin.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(function(admin) {
      if (admin) {
        admin.check_password(req.body.password, isMatch => {
          if (isMatch) {
            req.session.isLogin = true;
            req.session.user = admin;
            res.locals.userSession = req.session.user;
            res.redirect("/admin");
          } else {
            message_login = "Username atau password salah";
            alert = "danger";
            res.redirect("/admin/auth/login");
          }
        });
      } else {
        message_login = "Email anda belum terdaftar";
        alert = "danger";
        res.redirect("/admin/auth/login");
      }
    })
    .catch(function(err) {
      message_login = err.message;
      alert = "danger";
      res.redirect("/admin/auth/login");
    });
});

router.post("/forgot", (req, res) => {
  Model.Admin.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(admin) {
    if (admin) {
      Model.Setting.findAll().then(function(setting) {
        let info = "";
        let token = library.randomValueBase64(64);
        let link = req.headers.host + "/admin/auth/reset/" + token;

        let objUser = {
          reset_token: token,
          reset_expired: Date.now() + 3600000
        };

        let objMail = {
          to: req.body.email,
          subject: `[${setting[0].app_name}] Permintaan reset password.`,
          body: template.reset_password(admin, link)
        };
        queue.create("email", objMail).save(function(err) {
          if (!err) console.log(err);
        });

        Model.Admin.update(objUser, {
          where: {
            id: admin.id
          }
        })
          .then(function() {
            message_login = `Reset password telah dikirim ke email ${
              admin.email
            }`;
            alert = "success";
            res.redirect("/admin/auth/login");
          })
          .catch(function(err) {
            message_login = err.message;
            alert = "danger";
            res.redirect("/admin/auth/login");
          });
      });
    } else {
      message_login = "Maaf email anda belum terdaftar";
      alert = "danger";
      rres.redirect("/admin/auth/login");
    }
  });
});
router.get("/logout", (req, res) => {
  req.session.isLogin = false;
  req.session.destroy(err => {
    if (!err) {
      req.session = null;
      res.locals.user = null;
      res.locals.userSession = null;
      res.redirect("/admin/auth/login");
    }
  });
});

router.get("/reset/:token", (req, res) => {
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
            alert
          });
          alert=null
          message_login = null;
        } else {
          message_login =
            "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!";
          alert = "danger";
          res.redirect("/admin/auth/login");
        }
      } else {
        message_login = "Maaf email anda tidak tertedeksi oleh sistem atau tunggu pemberitahuan di email anda";
        alert = "danger";
        res.redirect("/admin/auth/login");
      }
    });
  });
});

router.post("/reset/:token", (req, res) => {
  if (req.body.password != req.body.retype_password) {
    message_login = "Verifikasi password tidak sesuai dengan password !!";
    alert = "danger";
    res.redirect(`/admin/auth/reset/${req.params.token}`);
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
                message_login =
                  "Reset password telah berhasil, silahkan melakukan login !!";
                alert = "success";
                res.redirect("/admin/auth/login");
              })
              .catch(function(err) {
                message_login = err.message;
                alert = "danger";
                res.redirect(`/admin/auth/reset/${req.params.token}`);
              });
          } else {
            message_login =
              "Permintaan reset password sudah melewati batas waktu (maks. 1 jam), silahkan melakukan permintaan reset password kembali !!";
            alert = "danger";
            res.redirect("/admin/auth/login");
          }
        } else {
          message_login = "Maaf email anda tidak tertedeksi oleh sistem";
          alert = "danger";
          res.redirect("/admin/auth/login");
        }
      });
    });
  }
});

router.get("*", (req, res) => {
  message_login = "Situs tidak ditemukan";
  alert = "danger";
  res.redirect("/admin/auth/login");
});
module.exports = router;
