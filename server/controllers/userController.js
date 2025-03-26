const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

class UserController {
  static async register(req, res, next) {
    try {
      let { fullName, email, password, phoneNumber, gender, address } =
        req.body;

      const data = await User.create({
        fullName,
        email,
        password,
        phoneNumber,
        gender,
        address,
      });

      res.status(201).json({
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
        address: data.address,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "BadRequest", message: "Email is required!" };
      }

      if (!password) {
        throw { name: "BadRequest", message: "Password is required!" };
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Unauthorized", message: "Email/Password is invalid!" };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { name: "Unauthorized", message: "Email/Password is invalid!" };
      }
      console.log(user, "user <<<<<<<<<<<<<<<");

      req.user = user;

      const access_token = signToken({ id: user.id, fullName: user.fullName });

      res.status(200).json({ access_token, UserId: user.id, role: user.role });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { googleToken } = req.body;
      if (!googleToken) {
        throw { name: "BadRequest", message: "Google Token is required" };
      }

      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      let dummyPassword =
        Math.random().toString() + "=" + Date.now() + "=" + crypto.randomUUID();

      const [user] = await User.findOrCreate({
        where: {
          email: payload.email,
        },
        defaults: {
          fullName: payload.name,
          email: payload.email,
          password: dummyPassword,
          phoneNumber: "-",
          gender: "-",
          address: "-",
          role: "User",
        },
      });

      const access_token = signToken({ id: user.id });
      
      res.status(200).json({ access_token, user: { fullName: user.fullName, role: user.role }});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
