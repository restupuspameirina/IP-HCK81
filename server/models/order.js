"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "UserId" });
      Order.hasMany(models.OrderItem, { foreignKey: "OrderId" });
    }
  }
  Order.init(
    {
      codeOrder: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Code order is required!",
          },
          notNull: {
            msg: "Code order is required!",
          },
        },
      },
      totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Total amount is required!",
          },
          notNull: {
            msg: "Total amount is required!",
          },
        },
      },
      paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      orderStatus: {
        type: DataTypes.STRING,
        defaultValue: "Pending",
      },
      methodPayment: {
        type: DataTypes.INTEGER,
      },
      midtransToken: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "User is required!",
          },
          notNull: {
            msg: "User is required!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
