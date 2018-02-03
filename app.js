const Model         = require('./models')
const authSession   = require('./helpers/authLogin')
const send          = require('./helpers/notification')
const ejs           = require('ejs')
const express       = require('express')
const favicon       = require('express-favicon')
const session       = require('express-session')
const bodyParser    = require('body-parser')
const multer        = require('multer')
const kue           = require('kue')
const configRedis   = require(__dirname + '/config/config.json')['redis']
const app           = express()
const port          = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', './views')
app.set('view cache', false)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public', express.static(__dirname + '/public'))
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'))
app.use(session({ secret: 'surat-izin-2018', cookie: { maxAge: 3600000 } })) //3600000

app.use((req, res, next) => {
  res.locals.userSession = req.session.user
  next()
})

const queue = kue.createQueue({
  prefix: 'queue',
  redis: configRedis
});

kue.app.listen(configRedis.port)
queue.process('email', function(job, done) {
  send.email(job.data, (error, info) => {
    if (error) {
      console.log('error',error)
    } else {
      console.log(`success send email to ${job.data.to}`)
      done()
    }
  })
})

app.use('/', require('./routes/index'))

app.use('/user/login', require('./routes/user/login'))
app.use('/user/register', require('./routes/user/register'))
app.use('/user/activation', require('./routes/user/activation'))
app.use('/user/forgot', require('./routes/user/forgot'))
app.use('/user/reset', require('./routes/user/reset'))

app.use('/admin/login', require('./routes/admin/login'))
app.use('/admin/logout', require('./routes/admin/index'))
app.use('/admin/forgot', require('./routes/admin/forgot'))
app.use('/admin/reset', require('./routes/admin/reset'))

app.use('/user', authSession.checkSession, require('./routes/user/index'))
app.use('/admin', authSession.checkSession, require('./routes/admin/index'))

app.listen(port, () => console.log(`Sundul gan on http://localhost:${port} !!`))
