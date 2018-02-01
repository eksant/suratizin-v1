const Model   = require('../models')
const library = require('../helpers/library')
const express = require('express')
const Router  = express.Router()
const title   = 'Home'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Company.findAll({
      where:{
        validation:1
      }
    })
    .then(function(companyData){
      res.render('./index', {
        title       : title,
        action      : '',
        new_button  : false,
        alert       : objAlert,
        setting     : setting[0],
        library     : library,
        user        : null,
        company     :companyData,
      })
      objAlert  = null
    })
  })
})

module.exports = Router
