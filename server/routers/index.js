const express = require("express");
const errorHandler = require("../middlewares/errorHandler");
const UserController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const Controller = require("../controllers/controller");
const router = express.Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);

router.use(authentication);

router.get("/books", Controller.listBooks);

router.post("/books", Controller.createBook);

router.put("/books/:id", Controller.updateBook);

router.get("/books/:id", Controller.detailBook);

router.delete("/books/:id", Controller.deleteBook);

router.get("/genres", Controller.listGenres);

router.get("/orders", Controller.listOrders);

router.post("/orders", Controller.makeOrder);

router.use(errorHandler);

module.exports = router;
