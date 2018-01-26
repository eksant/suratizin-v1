'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Requests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      location_province: {
        type: Sequelize.INTEGER
      },
      location_city: {
        type: Sequelize.STRING
      },
      necessities: {
        type: Sequelize.STRING
      },
      photo_building: {
        type: Sequelize.STRING
      },
      photo_plan: {
        type: Sequelize.STRING
      },
      attachment: {
        type: Sequelize.STRING
      },
      needed_date: {
        type: Sequelize.DATE
      },
      remark: {
        type: Sequelize.TEXT
      },
      payment_method: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Requests');
  }
};