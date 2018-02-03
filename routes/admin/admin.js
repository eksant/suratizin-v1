const Model = require("../../models");
const message = require("../../helpers/message");
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
let objAlert = null;
let title = "Admin"
function list(req, res) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Admin.findAll().then(function(admin) {
        admin.map(e => {
          e.roleName = getRole(e.role);
          e.encryptId = library.encrypt(String(e.id));
        });
        res.render("./admin/index", {
          content: "adminList",
          title,
          action: "",
          admin: admin,
          setting: setting[0],
          new_button: true,
          alert: objAlert
        });
        objAlert = null;
      });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/list");
    });
}

function addGet(req, res) {
  Model.Setting.findAll()
    .then(function(setting) {
      res.render("./admin", {
        content: "admin",
        title,
        action: "",
        admin: null,
        setting: setting[0],
        new_button: true,
        alert: objAlert
      });
      objAlert = null;
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/add");
    });
}

function addPost(req, res) {
  if (req.body.password != req.body.password_repeat) {
    objAlert = message.error("Password repeat false");
    res.redirect("/admin/add");
  } else {
    Model.Admin.create({
      name: req.body.name,
      email: req.body.email,
      role: 1,
      gender: req.body.gender,
      handphone: req.body.handphone,
      address: req.body.address,
      password: library.encrypt(req.body.password)
    })
      .then(() => {
        objAlert = message.success();
        res.redirect("/admin/list");
      })
      .catch(err => {
        objAlert = message.error(err.message);
        res.redirect("/admin/add");
      });
  }
}
function editGet(req, res) {
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Admin.findById(library.decrypt(req.params.token)).then(admin => {
        res.render("./admin", {
          content: "admin",
          title,
          action: "",
          admin,
          setting: setting[0],
          new_button: true,
          alert: objAlert
        });
        objAlert = null;
      });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/edit/${req.params.token}`);
    });
}
function editPost(req, res) {
  let data = null;
  if (req.body.password != req.body.password_repeat) {
    objAlert = message.error("Password repeat false");
    res.redirect(`/admin/edit/${req.params.token}`);
  } else {
    if (req.body.password) {
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: library.encrypt(req.body.password),
        updatedAt: new Date()
      };
    } else {
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        updatedAt: new Date()
      };
    }
    Model.Admin.update(data, {
      where: {
        id: Number(library.decrypt(req.params.token))
      },
      individualHooks: false
    })
      .then(admin => {
        objAlert = message.success("Data berhasi diupdate");
        return res.redirect("/admin/list");
      })
      .catch(err => {
        objAlert = message.error(err.message);
        res.redirect(`/admin/edit/${req.params.token}`);
      });
  }
}
function destroy(req, res) {
  Model.Admin.destroy({
    where: {
      id: Number(library.decrypt(req.params.token))
    }
  })
    .then(() => {
      objAlert = message.success("Data berhasi dihapus");
      res.redirect("/admin/list");
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/list");
    });
}
module.exports = {
  list,
  addGet,
  addPost,
  editGet,
  editPost,
  destroy
};
