'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return [
      queryInterface.addColumn('Requests', 'AdminId', Sequelize.INTEGER),
      queryInterface.addColumn('Requests', 'title', Sequelize.STRING),
      queryInterface.addColumn('Requests', 'category', Sequelize.INTEGER),
      queryInterface.addColumn('Requests', 'sub_category', Sequelize.INTEGER)
    ]
  },

  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.removeColumn('Requests', 'AdminId'),
      queryInterface.removeColumn('Requests', 'title'),
      queryInterface.removeColumn('Requests', 'category'),
      queryInterface.removeColumn('Requests', 'sub_category')
    ]
  }
};
