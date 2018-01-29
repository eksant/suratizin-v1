const express = require('express')
const router = express.Router()
const Model  = require('../../models')
const rootIndex = './admin/index'

router.get('/', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        res.render(rootIndex, {
            title:'Admin Home',
            setting : setting[0],
            alert: null,
            action: '',
            content: 'dashboard',
        })
    })
})

router.get('/logout', (req, res)=>{
    req.session.isLogin = false
    req.session.destroy(err=>{
        if(!err){
            res.locals.user = null
            res.locals.userSession = null
            res.redirect('/admin')
        }
    })
    
})

router.get('/listUser', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.User.findAll()
        .then(userdata=>{
            res.render(rootIndex, {
                title:'List User',
                setting : setting[0],
                alert: null,
                action: '',
                content: 'listUser',
                user: userdata,
            })
        })
    })
})




module.exports = router