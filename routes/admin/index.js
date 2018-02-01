const express = require('express')
const router = express.Router()
const Model  = require('../../models')
const rootIndex = './admin/index'
const notif = require('../../helpers/notification');
const message = require('../../helpers/message');
const templateEmail = require('../../helpers/templateemail')
const Op          = require('sequelize').Op


router.get('/', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.User.findAll()
        .then(userData=>{
            Model.Company.findAll({
                where:{
                    validation:1
                }
            })
                .then(companyData=>{
                    Model.Company.findAll({
                        where:{
                            validation:0
                        }
                    })
                    .then(pendingData=>{
                        res.render(rootIndex, {
                            title:'Admin Home',
                            setting : setting[0],
                            alert: null,
                            user: userData.length,
                            company:companyData.length,
                            pending:pendingData.length,
                            action: '',
                            content: 'dashboard',
                        })
                    })
                })
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

router.get('/listCompany', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Company.findAll({
            where:{
                validation:1,
            }
        })
        .then(data=>{
            res.render(rootIndex, {
                title:'List Company',
                setting : setting[0],
                alert: null,
                action: '',
                content: 'companyList',
                company: data,
            })
        })
    })
})

router.get('/company/detail/:id', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Company.findById(req.params.id)
        .then(data=>{
            res.render(rootIndex, {
                title:'Detail Company',
                setting : setting[0],
                alert: null,
                action: '',
                content: 'companyDetail',
                company: data,
            })
        })
    })
})

router.get('/register', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Admin.findAll()
        .then(admindata=>{
            res.render(rootIndex, {
                title:'Admin',
                setting : setting[0],
                alert: null,
                action: '',
                content: 'adminList',
                admin: admindata,
            })
        })
    })
})

let objAdmin={
    name:'',
    email:'',
    gender:'',
    handphone:'',
}
router.get('/register/add', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
            res.render(rootIndex, {
                title:'Admin',
                setting : setting[0],
                alert: null,
                action: 'add',
                content: 'admin',
                admin: objAdmin,
        })
    })
})

router.post('/register/add', (req, res)=>{
        objAdmin={
            name:req.body.name,
            email:req.body.email,
            gender:req.body.gender,
            handphone:req.body.handphone,
            password:req.body.password,
            role:1,
        }
        Model.Admin.create(objAdmin)
        .then(function(){
            res.redirect('/admin/register')
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/register/edit/:id', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Admin.findById(req.params.id)
        .then(admindata=>{
            res.render(rootIndex, {
                title:'Admin',
                setting : setting[0],
                alert: null,
                action: 'edit',
                content: 'admin',
                admin: admindata,
            }) 
        })
    })
})

router.post('/register/edit/:id', (req, res)=>{
    objAdmin={
        id:req.params.id,
        name:req.body.name,
        email:req.body.email,
        gender:req.body.gender,
        address:req.body.address,
        handphone:req.body.handphone,
    }

    if(req.body.password!='') {
        objAdmin.password = req.body.password
    }
        Model.Admin.update(objAdmin,{
            where:{
                id : req.params.id
            }
        })
        .then(function(){
            res.redirect('/admin/register')
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/register/delete/:id', (req, res)=>{
    Model.Admin.destroy({
        where:{
            id: req.params.id
        }
    })
    .then(function(){
        res.redirect('/admin/register')
    })
    .catch(err=>{
        res.send(err)
    })
})

router.get('/validation', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Company.findAll({
            where:{
                validation: {
                    [Op.ne]: 1
                }
            }
        })
        .then(data=>{
            res.render(rootIndex, {
                title:'Validation Company',
                setting : setting[0],
                alert: null,
                action: '',
                content: 'companyList',
                company: data,
            })
        })
    })
})

router.get('/validasi/:id', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        objAdmin={
            validation:1,
            AdminId:res.locals.userSession.id,
        }
    
        Model.Company.findOne({
            where:{
                id: req.params.id,
            },
            include:[Model.User]
        })
        .then(function(company){
            Model.Company.update(objAdmin,{
                where:{
                    id : req.params.id
                }
            })
            .then(function(){
                let objMailCompany = {
                    to          : company.email,
                    subject     : `[${setting[0].app_name}] Selamat Perusahaan/Jasa Anda telah berhasil divalidasi.`,
                    body        : templateEmail.validation_success_company(setting[0], company),
                }
                notif.email(objMailCompany, function(error, info) {
                    if (!error) {
                    console.log(`email terkirim ke ${company.email}`)
                        // res.send('success')
                    } else {
                        console.log('email gagal terkirim')
                        // res.send(error)
                    }
                })
    
                let objMailUser = {
                    to          : company.User.email,
                    subject     : `[${setting[0].app_name}] Selamat Perusahaan/Jasa Anda telah berhasil divalidasi.`,
                    body        : templateEmail.validation_success_user(setting[0], company),
                }
                notif.email(objMailUser, function(error, info) {
                    if (!error) {
                    console.log(`email terkirim ke ${company.User.email}`)
                        // res.send('success')
    
                    } else {
                        console.log('email gagal terkirim')
                        // res.send(error)
                    }
                })
                res.redirect('/admin/listCompany')
            })
            .catch(err=>{
                res.send(err)
            })
        })
    })
})

router.get('/reject/:id', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        objAdmin={
            validation:2,
            AdminId:res.locals.userSession.id,
        }
    
        Model.Company.findOne({
            where:{
                id: req.params.id,
            },
            include:[Model.User]
        })
        .then(function(company){
            Model.Company.update(objAdmin,{
                where:{
                    id : req.params.id
                }
            })
            .then(function(){
                let objMailCompany = {
                    to          : company.email,
                    subject     : `[${setting[0].app_name}] Perusahaan/Jasa Anda gagal divalidasi.`,
                    body        : templateEmail.validation_rejected_company(setting[0], company),
                }
                notif.email(objMailCompany, function(error, info) {
                    if (!error) {
                    console.log(`email terkirim ke ${company.email}`)
                        // res.send('success')
                    } else {
                        console.log('email gagal terkirim')
                        // res.send(error)
                    }
                })
    
                let objMailUser = {
                    to          : company.User.email,
                    subject     : `[${setting[0].app_name}] Perusahaan/Jasa Anda gagal divalidasi.`,
                    body        : templateEmail.validation_rejected_user(setting[0], company),
                }
                notif.email(objMailUser, function(error, info) {
                    if (!error) {
                    console.log(`email terkirim ke ${company.User.email}`)
                        // res.send('success')
    
                    } else {
                        console.log('email gagal terkirim')
                        // res.send(error)
                    }
                })
                res.redirect('/admin/listCompany')
            })
            .catch(err=>{
                res.send(err)
            })
        })
    })
})


module.exports = router