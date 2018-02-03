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

router.post("/", (req, res) => {
  Model.Admin.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(admin) {
    if (admin) {
      Model.Setting.findAll().then(function(setting) {
        let info = "";
        let token = library.randomValueBase64(64);
        let link = req.headers.host + "/admin/reset/" + token;
        let objUser = {
          reset_token: token,
          reset_expired: Date.now() + 3600000
        };

        let objMail = {
          to: req.body.email,
          subject: `[${setting[0].app_name}] Permintaan lagi reset password.`,
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
            res.render("./admin/login", {
              title: "Login",
              message_login: `Reset password telah dikirim ke email ${
                admin.email
              }`,
              alert: "success"
            });
          })
          .catch(function(err) {
            res.render("./admin/login", {
              title: "Login",
              message_login: err.message,
              alert: "danger"
            });
          });
      });
    } else {
      res.render("./admin/login", {
        title: "Login",
        message_login: "Email tidak terdaftar, silahkan lakukan pendaftaran !!",
        alert: "danger"
      });
    }
  });
});
router.get("*", (req, res) => {
  res.redirect("/admin/login");
});

module.exports = Router;
