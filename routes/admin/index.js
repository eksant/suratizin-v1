const express = require("express");
const router = express.Router();
const Model = require("../../models");
const rootIndex = "./admin/index";
const notif = require("../../helpers/notification");
const message = require("../../helpers/message");
const templateEmail = require("../../helpers/templateemail");
const adminSession = require("../../helpers/adminSession");
const Op = require("sequelize").Op;
const library = require("../../helpers/library");
let objAlert = null;

var setting = require("./setting");
var profile = require("./profile");
var user = require("./user");
var admin = require("./admin");
var vendor = require("./vendor");
var dataMaster = require("./dataMaster");

router.get("/", (req, res) => {
  Model.Setting.findAll().then(setting => {
    Model.User.findAll()
      .then(userData => {
        Model.Company.findAll({
          where: {
            validation: 1
          }
        }).then(companyData => {
          Model.Company.findAll({
            where: {
              validation: 0
            }
          })
            .then(pendingData => {
              if (req.query) {
                objAlert = req.query.error;
              }
              res.render(rootIndex, {
                title: "Admin Home",
                setting: setting[0],
                alert: objAlert,
                user: userData.length,
                company: companyData.length,
                pending: pendingData.length,
                action: "",
                content: "dashboard"
              });
              objAlert = null;
            })
            .catch(err => {
              objAlert = message.error(err.message);
              res.redirect("/");
            });
        });
      })
      .catch(err => {
        objAlert = message.error(err.message);
        res.redirect("/");
      });
  });
});
router.get("/setting", setting.settingGet);
router.post("/setting", setting.settingPost);

router.get("/profile", profile.profileGet);
router.post("/profile/upload", profile.uploadPost);
router.post("/profile", profile.profilePost);

router.get("/listUser", user.listGet);

router.get("/list", adminSession, admin.list);
router.get("/add", adminSession, admin.addGet);
router.post("/add", adminSession, admin.addPost);
router.get("/edit/:token", adminSession, admin.editGet);
router.post("/edit/:token", adminSession, admin.editPost);
router.get("/delete/:token", adminSession, admin.destroy);

router.get("/listCompany", vendor.list);
router.get("/company/detail/:id", vendor.detailGet);
router.get("/validation", vendor.validasiGet);
router.get("/validasi/:id", vendor.validasiId);
router.get("/reject/:id", vendor.rejectId);

router.get("/data/region", dataMaster.list);
router.get("/data/region/province/add", dataMaster.addProvinceGet);
router.post("/data/region/province/add", dataMaster.addProvincePost);
router.get("/data/region/province/edit/:token", dataMaster.editProvinceGet);
router.post("/data/region/province/edit/:token", dataMaster.editProvincePost);
router.get("/data/region/province/delete/:token", dataMaster.destroyProvince);
router.get("/data/region/regency/add", dataMaster.addRegencyGet);
router.post("/data/region/regency/add", dataMaster.addRegencyPost);
router.get("/data/region/regency/edit/:token", dataMaster.editRegencyGet);
router.post("/data/region/regency/edit/:token", dataMaster.editRegencyPost);
router.get("/data/region/regency/delete/:token", dataMaster.destroyRegency);
module.exports = router;
