const { User } = require('../models');
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
    try {
            const authorization = req.headers.authorization

        if (!authorization) {
            throw { name: "InvalidToken", message: "Invalid Token" };
        }

        const rawToken = authorization.split(" ");
        if (rawToken[0] !== 'Bearer' && rawToken[1]) {
            throw { name: "InvalidToken", message: "Invalid Token" };
        }

        const payload = verifyToken(rawToken[1]);

        const user = await User.findByPk(payload.id);
        if (!user) {
            throw { name: "InvalidToken", message: "Invalid Token" };
        }

        req.user = user;

        next();
        
    } catch (error) {
        next(error)
    }
}


module.exports = authentication;