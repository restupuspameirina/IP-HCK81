'use strict';
const {
  Model
} = require('sequelize');
const { hashPassword } = require('../helpers/bcrypt');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: "UserId" });
    }
  }
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Full name is required!"
        },
        notNull: {
          msg: "Full name is required!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "Email must be unique!"
      },
      validate: {
        notEmpty: {
          msg: "Email is required!"
        },
        notNull: {
          msg: "Email is required!"
        },
        isEmail: {
          msg: "Email must be email format!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required!"
        },
        notNull: {
          msg: "Password is required!"
        }
      }
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Phone number is required!"
        },
        notNull: {
          msg: "Phone number is required!"
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Gender is required!"
        },
        notNull: {
          msg: "Gender is required!"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Address is required!"
        },
        notNull: {
          msg: "Address is required!"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "User",
      validate: {
        notEmpty: {
          msg: "Role is required!"
        },
        notNull: {
          msg: "Role is required!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(input, option) {
        input.password = hashPassword(input.password);
      }
    }
  });
  return User;
};