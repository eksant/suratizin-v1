function sessionAdmin (req, res, next) {
  if (res.locals.userSession.role==0) {
    next()
  } else {
    res.redirect('/admin')
  }
}
module.exports = sessionAdmin;
