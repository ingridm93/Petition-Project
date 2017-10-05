const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/petition`);


module.exports.addProfileInfo = function (user_id, age, city, homepage) {

    const query = `INSERT INTO profiles (user_id, age, city, homepage) VALUES ($1, $2, $3, $4) RETURNING user_id`;
    return db.query(query, [user_id, age, city, homepage]);

};

module.exports.getProfileInfoById = function (id) {

    const select = `SELECT * FROM profiles`;
    const result = db.query(select, [id]);
    return result;

};

module.exports.getSignersBySignature = function () {
    const select = `SELECT users.first, users.last, profiles.age, profiles.city, profiles.homepage FROM signatures
                    LEFT OUTER JOIN profiles
                    ON signatures.user_id = profiles.user_id
                    JOIN users ON signatures.user_id = users.id
                    WHERE signatures.signature IS NOT NULL`;

    const query = db.query(select);
    return query;
};


module.exports.getSignersByCity = function (city) {
    const select = `SELECT users.first, users.last, profiles.age, profiles.city FROM users
                    JOIN profiles ON users.id = profiles.user_id
                    JOIN signatures ON profiles.user_id = signatures.user_id
                    WHERE signatures.signature IS NOT NULL AND profiles.city = $1`;

    const query = db.query(select, [city]);
    return query;
};


module.exports.getUserProfile = function (id) {
    const select = `SELECT users.first, users.last, users.email, profiles.age, profiles.city, profiles.homepage FROM users
                    LEFT OUTER JOIN profiles ON users.id = profiles.user_id
                    WHERE users.id = $1`;

    const query = db.query(select, [id]);
    return query;
};

module.exports.updateUserInfo = function (first, last, email, age, city, homepage, user_id) {

    const update = `UPDATE users, profiles SET users.first = $1, users.last = $2, users.email = $3, profiles.age = $4, profiles.city = $5, profiles.homepage = $6 WHERE user_id = $7 `;

    const result = db.query(update, [first, last, email, age, city, homepage, user_id]);
    return result;

};

module.exports.updateUserProfile = function (age, city, homepage, user_id) {

    const update = 'UPDATE profiles SET age=$1, city=$2, homepage=$3 WHERE user_id=$4';
    const result = db.query(update, [age, city, homepage, user_id])
    return result;
};

module.exports.updateUserInfo = function (first, last, email, user_id) {

    const update = 'UPDATE users SET first=$1, last=$2, email=$3 WHERE id=$4 RETURNING first,last';

    const result = db.query(update, [first, last, email, user_id]);
    return result;

};
