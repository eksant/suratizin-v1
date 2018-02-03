'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Portofolios', 'UserId', Sequelize.INTEGER),
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Portofolios', 'UserId'),
    ]
  }
};
