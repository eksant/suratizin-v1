'use strict';
module.exports = (sequelize, DataTypes) => {
  var Province = sequelize.define('Province', {
    codeProvince: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Province;
};
