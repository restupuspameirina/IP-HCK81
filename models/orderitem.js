'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.Order, { foreignKey: "OrderId" });
      OrderItem.belongsTo(models.Book, { foreignKey: "BookId" })
    }
  }
  OrderItem.init({
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Quantity is required!"
        },
        notNull: {
          msg: "Quantity is required!"
        },
        min: {
          args: 1,
          msg: "Quantity must be greater than 0"
        }
      }
    },
    unitPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Unit price is required!"
        },
        notNull: {
          msg: "Unit price is required!"
        },
        min: {
          args: 1,
          msg: "Unit price must be greater than 0"
        }
      }
    },
    OrderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Order is required!"
        },
        notNull: {
          msg: "Order is required!"
        }
      }
    },
    BookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Book is required!"
        },
        notNull: {
          msg: "Bokk is required!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};