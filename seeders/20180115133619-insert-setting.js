'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Settings', [{
      app_name: 'SuratIzin[dot]Com',
      app_copyright: '© 2018 suratizin[dot]com',
      app_admintheme: 'skin-blue',
      app_publictheme: 'skin-blue',
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Settings');
  }
};
