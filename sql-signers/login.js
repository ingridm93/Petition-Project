const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/petition`);
var bcrypt = require('bcryptjs');


module.exports.hashPassword = function (plainTextPassword) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(function (err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function (err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);

            });
        });
    });
};


module.exports.checkPassword = function (textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function (err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};


module.exports.addUser = function (email, password, first, last) {
    const insert = `INSERT INTO users (email, password, first, last) VALUES ($1, $2, $3, $4) RETURNING id, first, last`;
    const result = db.query(insert, [email, password, first, last]);
    return result;
};


module.exports.getUserByEmail = function (email) {
    const select = `SELECT id, email, password, first, last FROM users WHERE email = $1`;
    const result = db.query(select, [email]);
    return result;
};


module.exports.getSigners = function () {
    const select = `SELECT user_id FROM signatures WHERE signature = $1`;
    const result = db.query(select);
    return result;
};

module.exports.updatePassword = function (newPass, user_id) {
    const update = `UPDATE profiles SET password = $1 WHERE user_id = $2 `;
    const result = db.query(update, [newPass, user_id]);
    return result;

}
