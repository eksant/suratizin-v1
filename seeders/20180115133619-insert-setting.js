'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Settings', [{
      app_name: 'SuratIzin[dot]Com',
      app_copyright: '© 2018 suratizin[dot]com',
      app_admintheme: 'skin-blue',
      app_publictheme: 'skin-blue',
      mail_host: 'smtp.zoho.com',
      mail_port: 465,
      mail_secure: 1,
      mail_username: 'services@trippediacity.com',
      mail_password: 'Tr1pped1@city',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Settings');
  }
};
