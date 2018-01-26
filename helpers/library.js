'uses strict'
const moment    = require('moment')
const crypto    = require('crypto')
const algorithm = 'aes192'
const password  = 'surat-izin-2018'

function encrypt(text) {
  let cipher  = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.encrypt = function(text) {
  let cipher  = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.decrypt = function(text) {
  let decipher = crypto.createDecipher(algorithm, password)
  let dec      = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.comparePassword = function(password, originPassword){
  return encrypt(password) == originPassword
}

exports.randomValueBase64 = function(len) {
  return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

exports.formatLocalDate = function(str) {
  if (str == '') {
    return ''
  }
  return moment(str).format('D-M-YYYY')
}

exports.parseDate = function(str) {
  if (str == '') {
    return ''
  }
  let xstr = moment(str).format('D-M-YYYY')
  let dmy = xstr.split('-');
  return new Date(dmy[2], dmy[1]-1, dmy[0])
}

exports.dayDiff = function(start, end) {
  if (start == '' || end == '') {
    return null
  }
  let start_dmy   = start.split('-')
  let end_dmy     = end.split('-')
  let start_date  = new Date(start_dmy[2], start_dmy[1]-1, start_dmy[0])
  let end_date    = new Date(end_dmy[2], end_dmy[1]-1, end_dmy[0])
  return Math.round((end_date - start_date)/(1000 * 60 * 60 * 24))
}

exports.getMomentDate = function(str) {
  if (str == '') {
    return null
  }
  let dmy = str.split('-')
  let res = dmy[2].trim() + '-' + dmy[1].trim() + '-' + dmy[0].trim()
  return res.trim()
}

exports.getMomentDateTime = function(str) {
  let res = null
  if (str.trim() != '') {
    let dmy = str.split('-')
    let hms = dmy[2].split(' ')
    res = hms[0].trim() + '-' + dmy[1].trim() + '-' + dmy[0].trim() + ' ' + hms[1].trim() + ':00.000 +00:00'
  }
  return res
}

exports.getTime = function(str) {
  if (str == '') {
    return null
  }
  let dmy = str.trim().substring(str.indexOf('T')+1, str.indexOf('T')+6);
  return dmy;
}

exports.formatMoney = function(number, places = 0, symbol = '', thousand, decimal) {
	number = number || 0;
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "IDR";
	thousand = thousand || ",";
	decimal = decimal || ".";
	let negative = number < 0 ? "-" : "",
	    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
	    j = (j = i.length) > 3 ? j % 3 : 0;
	let result = symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  return (result != 0) ? result : ""
}

exports.getClientIp = function(req) {
  let ipAddress;
  let forwardedIpsStr = req.header('x-forwarded-for');

  if (forwardedIpsStr) {
    let forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }
  if (ipAddress == '::1' || ipAddress == '::ffff:127.0.0.1') {
    ipAddress = '127.0.0.1'
  }

  return ipAddress;
};
