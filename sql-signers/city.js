const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/petition`);


module.exports.getUserId = function () {
    const select = `SELECT user_id FROM signatures WHERE signature IS NOT NULL`;
    const query = db.query(select);
    return query;
};

module.exports.getAgeById = function (user_id, city) {
    const select = `SELECT age, city FROM profiles WHERE user_id = $1`;

    const query = db.query(select, [user_id, city]);
    return query;
};

module.exports.getNamesById = function (user_id) {
    const select = `SELECT first, last FROM users WHERE user_id = $1`;

    const query = db.query(select, [user_id]);
    return query;
};
