const Model = require("../../models");
const message = require("../../helpers/message");
const rootIndex = "./admin/index";
let objAlert = null;
let title="User"
function listGet(req, res){
    Model.Setting.findAll()
      .then(setting => {
        Model.User.findAll()
          .then(userdata => {
            res.render(rootIndex, {
              title,
              setting: setting[0],
              alert: objAlert,
              action: "",
              content: "listUser",
              user: userdata
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
module.exports = {
    listGet
};