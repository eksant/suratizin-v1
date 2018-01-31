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

router.get('/listCompany', (req, res)=>{
    Model.Setting.findAll()
    .then(setting=>{
        Model.Company.findAll()
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
                validation : 0,
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
    objAdmin={
        validation:1,
        AdminId:res.locals.userSession.id,
    }
        Model.Company.update(objAdmin,{
            where:{
                id : req.params.id
            }
        })
        .then(function(){
            res.redirect('/admin/listCompany')
        })
        .catch(err=>{
            res.send(err)
        })
})


module.exports = router