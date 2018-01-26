'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      app_name: {
        type: Sequelize.STRING
      },
      app_logo: {
        type: Sequelize.STRING
      },
      app_favicon: {
        type: Sequelize.STRING
      },
      app_copyright: {
        type: Sequelize.STRING
      },
      app_admintheme: {
        type: Sequelize.STRING
      },
      app_publictheme: {
        type: Sequelize.STRING
      },
      mail_host: {
        type: Sequelize.STRING
      },
      mail_port: {
        type: Sequelize.INTEGER
      },
      mail_secure: {
        type: Sequelize.INTEGER
      },
      mail_username: {
        type: Sequelize.STRING
      },
      mail_password: {
        type: Sequelize.STRING
      },
      sms_apikey: {
        type: Sequelize.STRING
      },
      sms_apisecret: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Settings');
  }
};