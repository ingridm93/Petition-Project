const dbQuery = require('../sql-signers/profile');
var redis = require('redis');
var client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function (err) {
    console.log(err);
});



function getCache(key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
                console.log('GET CACHE');
            }
        });
    });
}



function setCache(key, time, value) {
    return new Promise((resolve, reject) => {
        client.setex(key, time, value, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
                console.log('cache set')
            }
        });

    });
}

module.exports.delCache = function (key) {
    return new Promise((resolve, reject) => {
        client.del(key, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
                console.log('cache deleted')
            }
        });
    });
};


module.exports.checkCache = function (query, req, res) {
    if (query === 'getSignersBySignature') {

        getCache('signers').then((data) => {
            if (data) {

                var parse = JSON.parse(data);
                console.log('parsed', parse.rows);
                res.render('signers', {
                    signer: parse.rows
                });
            } else {
                dbQuery.getSignersBySignature()
                .then((result) => {

                    var string = JSON.stringify(result);
                    var time = 14 * 24 * 60;
                    console.log('stringify', string);

                    setCache('signers', time, string);
                })
                .then(() => {
                    res.render('signers');
                })
                .catch((err) => {
                        console.log(err);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
};

module.exports.setCacheOnSignaturePost = function (res, req) {

    dbQuery.getSignersBySignature()
    .then((result) => {

        var string = JSON.stringify(result);
        var time = 14 * 24 * 60;
            console.log('stringify', string);

        setCache('signers', time, string);
    })
    .catch((err) => {
        console.log(err);
    });
};
