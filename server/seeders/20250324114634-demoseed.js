"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // seed users
    let users = require("../data/users.json").map((user) => {
      user.createdAt = user.updatedAt = new Date();
      user.password = hashPassword(user.password);

      return user;
    });

    await queryInterface.bulkInsert("Users", users, {});

    // seed genre
    let genres = require("../data/genre.json").map((genre) => {
      genre.createdAt = genre.updatedAt = new Date();
      return genre;
    });

    await queryInterface.bulkInsert("Genres", genres, {});

    // seed book
    let books = require("../data/book.json").map((book) => {
      book.createdAt = book.updatedAt = new Date();
      return book;
    });

    await queryInterface.bulkInsert("Books", books, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Books", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete("Genres", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete("Users", null, {
      restartIdentity: true,
      truncate: true,
      cascade: true,
    });
  },
};
