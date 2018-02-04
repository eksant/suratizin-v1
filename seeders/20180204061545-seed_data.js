'use strict';
const fs = require('fs');
var a=fs.readFileSync('./documents/csv_wilayah/provinces.csv','utf-8').trim().split('\n')
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
      let data=[]
      a.forEach(element => {
        element=element.split(',')
        let hey = {
          codeProvince:element[0],
          name:element[1],
          createdAt:new Date(),
          updatedAt: new Date()
        }
        data.push(hey)
      });

    return queryInterface.bulkInsert('Provinces',data);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
