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
      where: {
        validation: 1
      }
    })
    .then(function(items){
      res.render('./index', {
        title       : title,
        action      : '',
        new_button  : false,
        alert       : objAlert,
        setting     : setting[0],
        items       : items,
        library     : library,
        filter      : null,
        user        : null,
      })
      objAlert  = null
    })
  })
})

Router.post('/filter', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    let objFilter
    if (req.body.location_city != '') {
       objFilter = {
        validation  : 1,
        category    : req.body.category,
        city        : {$iLike: `%${req.body.location_city}%`},
      }
    } else {
      objFilter = {
       validation  : 1,
       category    : req.body.category,
     }
    }
    Model.Company.findAll({
      where: objFilter
    })
    .then(function(items){
      res.render('./index', {
        title       : title,
        action      : '',
        new_button  : false,
        alert       : objAlert,
        setting     : setting[0],
        items       : items,
        library     : library,
        filter      : objFilter,
        user        : null,
      })
      objAlert  = null
    })
  })
})

module.exports = Router
