function checkSession(req, res, next) {
  if (req.session.isLogin) {
    // res.locals.userSession = req.session.user
    if (req.originalUrl == '/admin' && req.session.user.role > 1) {
      res.redirect('/user')
    }else{
      next(res.path)
    }
  } else {
    res.locals.userSession = null
    let pathLogin = (req.originalUrl == '/admin') ? '/admin/login' : '/user/login'
    res.redirect(pathLogin)
  }
}

module.exports = {
  checkSession: checkSession,
};
