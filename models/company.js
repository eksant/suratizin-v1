'use strict';
const getCategory  = require('../helpers/getCategory')
const Op           = require('sequelize').Op

module.exports = (sequelize, DataTypes) => {
  var Company = sequelize.define('Company', {
    AdminId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must be filled !!'
        },
        isUnique: function(value, next) {
          Company.findAll({
            where:{
              name: value,
              id: { [Op.ne]: this.id, }
            }
          })
          .then(function(company) {
            if (company.length == 0) {
              next()
            } else {
              next('Nama perusahaan sudah terdaftar !!')
            }
          })
          .catch(function(err) {
            next(err)
          })
        }
      }
    },
    logo: DataTypes.STRING,
    category: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Category must be filled !!'
        },
        // isUnique: function(value, next) {
        //   Company.findAll({
        //     where:{
        //       category: value,
        //       id: { [Op.ne]: this.id, }
        //     }
        //   })
        //   .then(function(category) {
        //     if (category.length == 0) {
        //       next()
        //     } else {
        //       next('Kategori perusahaan sudah terdaftar !!')
        //     }
        //   })
        //   .catch(function(err) {
        //     next(err)
        //   })
        // }
      }
    },
    sub_category: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    address: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Address must be filled !!'
        },
      }
    },
    province: DataTypes.INTEGER,
    city: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'City must be filled !!'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email Company must be filled !!'
        },
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Phone must be filled !!'
        },
      }
    },
    fax: DataTypes.STRING,
    year_establishment: DataTypes.INTEGER,
    total_employes: DataTypes.INTEGER,
    website: DataTypes.STRING,
    bank_account_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Bank account name must be filled !!'
        },
      }
    },
    bank_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name of bank must be filled !!'
        },
      }
    },
    bank_branch: DataTypes.STRING,
    bank_account_number: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Bank account number must be filled !!'
        },
      }
    },
    photo_siup: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Photo SIUP/NPWP wajib di upload !!'
        },
      }
    },
    photo_valid_bill: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Photo Tagihan Listrik/Telp/Internet yang sesuai dengan alamat perusahaan/jasa wajib di upload !!'
        },
      }
    },
    validation: DataTypes.INTEGER
  });

  Company.prototype.getCategory = function() {
    return getCategory(this.category)
  }

  Company.associate = function(models) {
    Company.belongsTo(models.User)
    Company.hasMany(models.Portofolio)
    Company.hasMany(models.Propose)
  }

  return Company;
};
