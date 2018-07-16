'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      name: 'Superadmin',
      email: 'superadmin@suratizin.com',
      password: '70f41bf828a19aa28d9ffc198c06f796',
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Admins');
  }
};
