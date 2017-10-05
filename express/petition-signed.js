const dbQuery = require('../sql-signers/sql-signers');
const redis = require('./redis');
const express = require('express');
const router = express.Router();



router.route('/signed')


    .get((req, res) => {

        if (!req.session.signatureId && !req.session.user) {

            res.redirect('/login');

        } else if (!req.session.signatureId && req.session.user) {

            res.redirect('/petition/sign');

        } else {

            const { first, last, } = req.session.user;

            Promise.all([
                dbQuery.getSignatureById(req.session.signatureId),
                dbQuery.signatureCount()

            ])
            .then((arr) => {
                if (!arr[0].rows[0]) {
                    res.render('layout', {
                        first: first,
                        last: last
                    });

                } else {

                    redis.setCacheOnSignaturePost();

                    const signature = arr[0].rows[0].signature;

                    const total = arr[1].rows[0].count;

                    res.render('signed', {
                        signersTotal: total,
                        link: '/petition/signers',
                        signature: signature,
                        first: first,
                        last: last,
                        logout: '/logout'

                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    });



module.exports = router;
