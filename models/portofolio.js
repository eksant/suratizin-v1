'use strict';
module.exports = (sequelize, DataTypes) => {
  var Portofolio = sequelize.define('Portofolio', {
    CompanyId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    photo: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return Portofolio;
};