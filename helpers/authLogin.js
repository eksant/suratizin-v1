module.exports.checkSession = function(req, res, next) {
  // req.session.isLogin=true
  
  // req.session.user={
  //   name:"superAdmin",
  //   email:"saddasdas",
  //   role:0,
  //   id:1,
  //   photo:"photo_1517667913919_aamaawdgaawaaqaaaaaaaa7jaaaajdnjmjzjnzy2lwzmywitngm3os04ndiyltljntezzmu3odyzza.jpg",
  //   createdAt:new Date()
  // }

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
    let pathLogin = (req.originalUrl == '/admin') ? '/admin/auth' : '/user/login'
    res.redirect(pathLogin)
  }
}
