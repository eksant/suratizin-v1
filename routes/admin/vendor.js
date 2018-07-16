const express = require("express");
const router = express.Router();
const Model = require("../../models");
const rootIndex = "./admin/index";
const notif = require("../../helpers/notification");
const message = require("../../helpers/message");
const templateEmail = require("../../helpers/templateemail");
const adminSession = require("../../helpers/adminSession");
const Op = require("sequelize").Op;
let objAlert = null;
const kue = require("kue");
const queue = kue.createQueue();
let title='Company'
function list(req, res) {
  Model.Setting.findAll().then(setting => {
    let dataSearch={
        where:{
            validation: 1
        }
    }
    if(Number(req.session.user.role)>0){
      Model.Company.findAll({
        where:{
          validation:1,
          AdminId:req.session.user.id
        }
      })
      .then(data => {
        res.render(rootIndex, {
          title,
          setting: setting[0],
          alert: null,
          action: "",
          content: "companyList",
          company: data
        });
        objAlert = null;
      })
      .catch(err => {
        objAlert = message.error(err.message);
        res.redirect("/admin");
      });
    }else{
      Model.Company.findAll({
        where:{
          validation:1
        }
      })
      .then(data => {
        res.render(rootIndex, {
          title,
          setting: setting[0],
          alert: null,
          action: "",
          content: "companyList",
          company: data
        });
        objAlert = null;
      })
      .catch(err => {
        console.log(err.message);
        objAlert = message.error(err.message);
        res.redirect("/admin");
      });
    } 
  }).catch(err => {
    console.log(err.message);
    objAlert = message.error(err.message);
    res.redirect("/admin");
  });
}
function detailGet(req, res) {
  Model.Setting.findAll()
    .then(setting => {
      Model.Company.findById(req.params.id)
        .then(data => {
          res.render(rootIndex, {
            title,
            setting: setting[0],
            alert: null,
            action: "",
            content: "companyDetail",
            company: data
          });
          objAlert = null;
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin");
    });
}
function validasiGet(req, res) {
  Model.Setting.findAll()
    .then(setting => {
      Model.Company.findAll({
        where: {
          validation: {
            [Op.ne]: 1
          }
        }
      })
        .then(data => {
          res.render(rootIndex, {
            title,
            setting: setting[0],
            alert: objAlert,
            action: "",
            content: "companyList",
            company: data
          });
          objAlert = null;
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin");
    });
}
function validasiId(req, res) {
  Model.Setting.findAll()
    .then(setting => {
      objAdmin = {
        validation: 1,
        AdminId: res.locals.userSession.id
      };

      Model.Company.findOne({
        where: {
          id: req.params.id
        },
        include: [Model.User]
      })
        .then(function(company) {
          Model.Company.update(objAdmin, {
            where: {
              id: req.params.id
            }
          })
            .then(function() {
              let objMailCompany = {
                to: company.email,
                subject: `[${
                  setting[0].app_name
                }] Selamat Perusahaan/Jasa Anda telah berhasil divalidasi.`,
                body: templateEmail.validation_success_company(
                  setting[0],
                  company
                )
              };
              queue.create("email", objMailCompany).save(function(err) {
                if (!err) console.log(err);
              });

              let objMailUser = {
                to: company.User.email,
                subject: `[${
                  setting[0].app_name
                }] Selamat Perusahaan/Jasa Anda telah berhasil divalidasi.`,
                body: templateEmail.validation_success_user(setting[0], company)
              };
              queue.create("email", objMailUser).save(function(err) {
                if (!err) console.log(err);
              });
              res.redirect("/admin/listCompany");
            })
            .catch(err => {
              objAlert = message.error(err.message);
              res.redirect("/admin/validation");
            });
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/validation");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/validation");
    });
}
function rejectId(req, res) {
  Model.Setting.findAll()
    .then(setting => {
      objAdmin = {
        validation: 2,
        AdminId: res.locals.userSession.id
      };

      Model.Company.findOne({
        where: {
          id: req.params.id
        },
        include: [Model.User]
      })
        .then(function(company) {
          Model.Company.update(objAdmin, {
            where: {
              id: req.params.id
            }
          })
            .then(function() {
              let objMailCompany = {
                to: company.email,
                subject: `[${
                  setting[0].app_name
                }] Perusahaan/Jasa Anda gagal divalidasi.`,
                body: templateEmail.validation_rejected_company(
                  setting[0],
                  company
                )
              };
              queue.create("email", objMailCompany).save(function(err) {
                if (!err) console.log(err);
              });

              let objMailUser = {
                to: company.User.email,
                subject: `[${
                  setting[0].app_name
                }] Perusahaan/Jasa Anda gagal divalidasi.`,
                body: templateEmail.validation_rejected_user(
                  setting[0],
                  company
                )
              };
              queue.create("email", objMailUser).save(function(err) {
                if (!err) console.log(err);
              });
              res.redirect("/admin/listCompany");
            })
            .catch(err => {
              objAlert = message.error(err.message);
              res.redirect("/admin/validation");
            });
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/validation");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/validation");
    });
}
module.exports = {
  list,
  detailGet,
  validasiGet,
  validasiId,
  rejectId
};
