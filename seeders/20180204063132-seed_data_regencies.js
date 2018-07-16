'use strict';
const fs = require('fs');
var a=fs.readFileSync('./documents/csv_wilayah/regencies.csv','utf-8').trim().split('\n')
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
          codeRegency:element[0],
          codeProvince:element[1],
          name:element[2],
          createdAt:new Date(),
          updatedAt: new Date()
        }
        data.push(hey)
      });
    return queryInterface.bulkInsert('Regencies',data);
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
