'use strict';
module.exports = (sequelize, DataTypes) => {
  var Setting = sequelize.define('Setting', {
    app_name: DataTypes.STRING,
    app_logo: DataTypes.STRING,
    app_favicon: DataTypes.STRING,
    app_copyright: DataTypes.STRING,
    app_admintheme: DataTypes.STRING,
    app_publictheme: DataTypes.STRING,
    mail_host: DataTypes.STRING,
    mail_port: DataTypes.INTEGER,
    mail_secure: DataTypes.INTEGER,
    mail_username: DataTypes.STRING,
    mail_password: DataTypes.STRING,
    sms_apikey: DataTypes.STRING,
    sms_apisecret: DataTypes.STRING
  });
  return Setting;
};