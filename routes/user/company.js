const Model       = require('../../models')
const message     = require('../../helpers/message')
const library     = require('../../helpers/library')
const title       = 'Profile Perusahaan/Jasa'

let objCompany = {
  name                : '',
  logo                : '',
  category            : '',
  sub_category        : '',
  description         : '',
  address             : '',
  province            : '',
  city                : '',
  email               : '',
  phone               : '',
  fax                 : '',
  year_establishment  : '',
  total_employes      : '',
  website             : '',
  bank_account_name   : '',
  bank_name           : '',
  bank_branch         : '',
  bank_account_number : '',
  photo_siup          : '',
  photo_valid_bill    : '',
}

module.exports.read = function(id, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findAll({
      where: {
        UserId: id,
      },
      order: [
        ['name', 'ASC'],
        ['createdAt', 'ASC'],
      ],
      include: [Model.User],
    })
    .then(function(company) {
      callback({
        content     : 'company',
        setting     : setting[0],
        library     : library,
        title       : title,
        action      : '',
        company     : company,
        alert       : null,
      })
    })
  })
}

module.exports.add = function(callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    callback({
      content     : 'company_form',
      setting     : setting[0],
      library     : library,
      title       : title,
      action      : 'add',
      company     : objCompany,
      alert       : null,
    })
  })
}
