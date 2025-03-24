const bcrypt = require('bcrypt');

function hashPassword(pasword) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(pasword, salt);

    return hash;
}

function comparePassword(pasword, hashedPassword) {
    return bcrypt.compareSync(pasword, hashedPassword);
}


module.exports = {
    hashPassword,
    comparePassword
}