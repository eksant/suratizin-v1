'use strict';
module.exports = (sequelize, DataTypes) => {
  var Portofolio = sequelize.define('Portofolio', {
    CompanyId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Title portofolio wajib di upload !!'
        },
      }
    },
    photo: DataTypes.STRING,
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Deskripsi portofolio wajib di upload !!'
        },
      }
    },
  });

  Portofolio.associate = function(models) {
    Portofolio.belongsTo(models.Company)
    Portofolio.belongsTo(models.User)
  }

  return Portofolio;
};
