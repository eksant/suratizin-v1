const Model = require("../../models");
const message = require("../../helpers/message");
const express = require("express");
const Router = express.Router();
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
let objAlert = null;

function settingGet(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Setting.findAll().then(function(setting) {
    if (!setting) {
      let objSetting = {
        app_name: null,
        app_logo: null,
        app_favicon: null,
        app_copyright: null,
        app_admintheme: null,
        app_publictheme: null,
        mail_host: null,
        mail_port: null,
        mail_secure: null,
        mail_username: null,
        mail_password: null,
        sms_apikey: null,
        sms_apisecret: null
      };
      Model.Setting.create(objSetting).then(function() {
        Model.Setting.findAll().then(function(setting) {
            console.log('hey');
          res.render("./admin/index", {
            path: 2,
            title: "Setting",
            action: "",
            new_button: false,
            setting: setting[0],
            alert: objAlert,
            content:'settingForm'
          });
          objAlert = null;
        });
      });
    } else {
      res.render("./admin/index", {
        title: "Setting",
        action: "",
        new_button: false,
        setting: setting[0],
        alert: objAlert,
        content:'settingForm'
      });
      objAlert = null;
    }
  }).catch(function(err) {
    objAlert = message.error(err.message);
    res.redirect("/admin/setting");
  });
}
function settingPost(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Setting.findAll().then(function(setting) {
    let mail_secure = req.body.mail_secure == undefined
      ? 1
      : req.body.mail_secure;
    let objSetting = {
      app_name: req.body.app_name,
      app_logo: null,
      app_favicon: null,
      app_copyright: req.body.app_copyright,
      mail_host: req.body.mail_host,
      mail_port: req.body.mail_port,
      mail_secure: mail_secure,
      mail_username: req.body.mail_username,
      mail_password: req.body.mail_password,
      sms_apikey: req.body.sms_apikey,
      sms_apisecret: req.body.sms_apisecret,
      app_admintheme: req.body.app_admintheme,
      app_publictheme: req.body.app_publictheme
    };
    Model.Setting.update(objSetting, {
      where: {
        id: setting[0].id
      }
    }).then(function() {
      objAlert = message.success();
      res.redirect("/admin/setting");
    }).catch(function(err) {
      objAlert = message.error(err.message);
      res.redirect("/admin/setting");
    })
  }).catch(function(err) {
    objAlert = message.error(err.message);
    res.redirect("/admin/setting");
  })
}
module.exports = {
  settingPost,
  settingGet
};
