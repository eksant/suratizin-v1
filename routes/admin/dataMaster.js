const Model = require("../../models");
const message = require("../../helpers/message");
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
let objAlert = null;
let title = "Data Master";

function list(req, res, next) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Province.findAll().then(function(provinces) {
        provinces = provinces.map(e => {
          e.encryptId = library.encrypt(String(e.id));
          return e;
        });
        Model.Regency.findAll().then(function(regencies) {
          regencies = regencies.map(e => {
            e.encryptId = library.encrypt(String(e.id));
            return e;
          });
          res.render("./admin/index", {
            content: "listRegion",
            title: "Data Master",
            action: "",
            setting: setting[0],
            regencies,
            provinces,
            new_button: true,
            alert: objAlert
          });
          objAlert = null;
        });
      });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/list");
    });
}
function addProvinceGet(req, res, next) {
  Model.Setting.findAll()
    .then(function(setting) {
      let codeRegency = null;
      res.render("./admin/index", {
        content: "formRegion",
        title: "Data Master",
        action: "",
        setting: setting[0],
        data: null,
        codeRegency: null,
        new_button: true,
        alert: objAlert
      });
      objAlert = null;
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function addProvincePost(req, res, next) {
  Model.Province.create({
    codeProvince: req.body.codeProvince,
    name: req.body.name
  })
    .then(province => {
      objAlert = message.success("Berhasil menambahkan data");
      res.redirect("/admin/data/region");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function editProvinceGet(req, res, next) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Province.findById(library.decrypt(req.params.token))
        .then(data => {
          let codeRegency = null;
          res.render("./admin/index", {
            content: "formRegion",
            title: "Data Master",
            action: "",
            setting: setting[0],
            data,
            codeRegency: null,
            new_button: true,
            alert: objAlert
          });
          objAlert = null;
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/data/region");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function editProvincePost(req, res, next) {
  Model.Province.update(
    {
      codeProvince: req.body.codeProvince,
      name: req.body.name
    },
    {
      where: {
        id: library.decrypt(req.params.token)
      }
    }
  )
    .then(province => {
      objAlert = message.success("Berhasil menambahkan data");
      res.redirect("/admin/data/region");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function destroyProvince(req, res, next) {
  Model.Province.findById(library.decrypt(req.params.token))
    .then(province => {
      Model.Province.destroy({
        where: {
          id: library.decrypt(req.params.token)
        }
      })
        .then(() => {
          Model.Regency.destroy({
            where: {
              codeProvince: province.codeProvince
            }
          })
            .then(() => {
              objAlert = message.success("Data berhasil dihapus");
              res.redirect("/admin/data/region");
            })
            .catch(err => {
              objAlert = message.error(err.message);
              res.redirect("/admin/data/region");
            });
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/data/region");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function addRegencyGet(req, res, next) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Province.findAll().then(provinces => {
        let codeRegency = true;
        res.render("./admin/index", {
          content: "formRegion",
          title: "Data Master",
          action: "",
          setting: setting[0],
          data: null,
          provinces,
          codeRegency,
          new_button: true,
          alert: objAlert
        });
        objAlert = null;
      });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function addRegencyPost(req, res, next) {
  Model.Regency.create({
    codeProvince: req.body.codeProvince,
    codeRegency: req.body.codeRegency,
    name: req.body.name
  })
    .then(province => {
      objAlert = message.success("Berhasil menambahkan data");
      res.redirect("/admin/data/region");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function editRegencyGet(req, res, next) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Regency.findById(library.decrypt(req.params.token))
        .then(data => {
          Model.Province.findAll().then(provinces => {
            let codeRegency = true;
            res.render("./admin/index", {
              content: "formRegion",
              title: "Data Master",
              action: "",
              setting: setting[0],
              data,
              provinces,
              codeRegency,
              new_button: true,
              alert: objAlert
            });
            objAlert = null;
          });
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/data/region");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function editRegencyPost(req, res, next) {
  Model.Regency.update(
    {
      codeProvince: req.body.codeProvince,
      codeRegency: req.body.codeRegency,
      name: req.body.name
    },
    {
      where: {
        id: library.decrypt(req.params.token)
      }
    }
  )
    .then(province => {
      objAlert = message.success("Berhasil menambahkan data");
      res.redirect("/admin/data/region");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
function destroyRegency(req, res, next) {
  Model.Regency.destroy({
    where: {
      id: library.decrypt(req.params.token)
    }
  })
    .then(() => {
      objAlert = message.success("Data berhasil dihapus");
      res.redirect("/admin/data/region");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/data/region");
    });
}
module.exports = {
  list,
  addProvinceGet,
  addProvincePost,
  addRegencyGet,
  addRegencyPost,
  editProvinceGet,
  editProvincePost,
  editRegencyGet,
  editRegencyPost,
  destroyProvince,
  destroyRegency
};
