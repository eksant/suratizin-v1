'use strict';
module.exports = (sequelize, DataTypes) => {
  var Propose = sequelize.define('Propose', {
    CompanyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    RequestId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    negotiable: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    info_partner: DataTypes.TEXT,
    status: DataTypes.INTEGER
  });

  Propose.associate = function(models) {
    Propose.belongsTo(models.User)
    Propose.belongsTo(models.Request)
    Propose.belongsTo(models.Company)
  }

  return Propose;
};
