"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Book.belongsTo(models.Genre, { foreignKey: "GenreId" });
    }
  }
  Book.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Name is required!",
          },
          notNull: {
            msg: "Name is required!",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Price is required!",
          },
          notNull: {
            msg: "Price is required!",
          },
          min: {
            args: 1,
            msg: "Price must be greater than 0",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Image is required!",
          },
          notNull: {
            msg: "Image is required!",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Stock is required!",
          },
          notNull: {
            msg: "Stock is required!",
          },
        },
      },
      GenreId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Genre is required!",
          },
          notNull: {
            msg: "Genre is required!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
