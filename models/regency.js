'use strict';
module.exports = (sequelize, DataTypes) => {
  var Regency = sequelize.define('Regency', {
    codeRegency: DataTypes.INTEGER,
    codeProvince: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Regency;
};