const Model       = require('../models')
const nodemailer  = require('nodemailer')
const Nexmo       = require('nexmo')

exports.email = function(obj, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    if (setting[0].mail_host != '' && setting[0].mail_username != '') {
      let secure = true
      if (setting[0].mail_secure == 2) {
        secure = false
      }
      let transporter = nodemailer.createTransport({
        poll  : true,
        host  : setting[0].mail_host,
        port  : setting[0].mail_port,
        secure: secure, // true for 465, false for other ports
        auth: {
            user: setting[0].mail_username, // generated ethereal user
            pass: setting[0].mail_password,  // generated ethereal password
        }
      })
      let mailOptions = {
        from        : `${setting[0].app_name} <${setting[0].mail_username}>`, // sender address
        to          : obj.to, //profile.email, // list of receivers
        subject     : obj.subject, //'[Trippediacity] Request Reset Your Password', // Subject line
        html        : obj.body, //htmlmail.EmailBody(req.headers.host + '/reset/' + token), // html body
        attachments : obj.attachments || '',
      }
      transporter.sendMail(mailOptions, (error, info) => {
        callback(error, info)
      })
    }
  })
}

exports.sms = function(obj, callback) {
  Model.Setting.findAll()
  .then(function(setting) {
    if (setting[0].sms_apikey != '' && setting[0].sms_apisecret != '') {
      const nexmo = new Nexmo({
        apiKey    : setting[0].sms_apikey,
        apiSecret : setting[0].sms_apisecret,
      })

      let from  = 'NEXMO';
      let to    = obj.to;
      let text  = obj.text;
      nexmo.message.sendSms(from, to, text, {type: 'unicode'}, function(err, responseData) {
        callback(err, responseData)
      })
    }
  })
}
