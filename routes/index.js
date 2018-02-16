const Model   = require('../models')
const library = require('../helpers/library')
const express = require('express')
const Router  = express.Router()
const getRole   = require('../helpers/getRole')
const title   = 'Home'
var geoip = require('geoip-lite');
let objAlert  = null

Router.get('/', (req, res) => {
  Model.User.findAll({
    where:{
      role:{
        $gt:3
      }
    }
  }).then(usersForMaps=>{
    Model.Setting.findAll()
    .then(function(setting) {
      Model.Company.findAll({
        where: {
          validation: 1
        }
      })
      .then(function(items){
        usersForMaps=usersForMaps.map(e=>{
          e.email=null
          e.password=null
          e.status=null
          e.role=getRole(e.role)
          return e
        })
        var ip  = library.getClientIp(req) //(req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
        var geo = geoip.lookup(ip);
        // console.log(geo,ip);
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
          usersForMaps: usersForMaps,
          geo         : geo
        })
        objAlert  = null
      })
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
