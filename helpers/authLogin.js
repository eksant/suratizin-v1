module.exports.checkSession = function(req, res, next) {
  req.session.isLogin=true
  
  req.session.user={
    name:"superAdmin",
    email:"saddasdas",
    role:5,
    id:3,
    photo:"photo_1516528596704_images.png",
    createdAt:new Date('DD-MM-YYYY')
  }
  if (req.session.isLogin) {
    res.locals.userSession = req.session.user
    if (req.originalUrl == '/admin' && req.session.user.role > 1) {
      res.redirect('/user')
    }else{
      next(res.path)
    }
  } else {
    req.session.isLogin     = false
    res.locals.userSession  = null
    let pathLogin = (req.originalUrl == '/admin') ? '/admin/auth/login' : '/user/login'
    res.redirect(pathLogin)
  }
}
