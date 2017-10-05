const spicedPg = require('spiced-pg');
const secrets = require('../secrets.json');

const db = spicedPg(`postgres:${secrets.dbuser}:${secrets.dbpassword}@localhost:5432/petition`);

function addSignature (signature, user_id) {
    const query = `INSERT INTO signatures (signature, user_id) VALUES ($1, $2) RETURNING user_id`;
    return db.query(query, [signature, user_id]);

}

function getSignatureById (user_id) {
    const select = `SELECT signature FROM signatures WHERE user_id = $1`;
    const result = db.query(select, [user_id]);
    return result;
}



function signatureCount () {
    const select = `SELECT count(signature) FROM signatures`;
    const result = db.query(select);
    return result;
}


function deleteSignature (id) {
    const deleteSig = `DELETE FROM signatures WHERE user_id = $1`;
    const result = db.query(deleteSig, [id]);
    return result;
}



module.exports.addSignature = addSignature;

module.exports.getSignatureById = getSignatureById;

module.exports.signatureCount = signatureCount;

module.exports.deleteSignature = deleteSignature;
