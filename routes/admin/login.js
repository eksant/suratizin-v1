const express = require("express");
const router = express.Router();
const Model = require("../../models");
const message = require("../../helpers/message");
const library = require("../../helpers/library");

router.get("/", (req, res) => {
  res.render("./admin/login", {
    title: "Admin Home",
    message_login: null,
    alert: ""
    //psgd:library.encrypt('password')
  });
});

router.post("/", (req, res) => {
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
            res.render("./admin/login", {
              title: "Admin Home",
              message_login: "Username atau password salah",
              alert: "danger"
            });
          }
        });
      } else {
        res.render("./admin/login", {
          title: "Admin Home",
          message_login: "Username atau password salah",
          alert: "danger"
        });
      }
    })
    .catch(function(err) {
      res.render("./admin/login", {
        title: "Admin Home",
        message_login: err.message,
        alert: "danger"
      });
    });
});

module.exports = router;
