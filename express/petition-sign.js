const dbQuery = require('../sql-signers/sql-signers');
const redis = require('./redis');
const express = require('express');
const router = express.Router();



router.route('/sign')

    .get((req, res) => {

        if (!req.session.user) {
            res.redirect('/login');
        } else {

            const { first, last, id } = req.session.user;

            dbQuery.getSignatureById(id)
            .then((result) => {

                if (!result.rows[0]) {

                    res.render('layout', {
                        first: first,
                        last: last
                    });

                } else {

                    req.session.signatureId = id;
                    res.redirect('/petition/signed');
                }
            })
            .catch((err) => {
                console.log(err);
            });
        }
    })

    .post((req, res) => {

        if (req.body.signature) {

            redis.delCache('signers');

            dbQuery.addSignature(req.body.signature, req.session.user.id)

            .then(function (result) {

                req.session.signatureId = result.rows[0].user_id;
                res.redirect('/petition/signed');
            })
            .catch(function (err) {
                console.log(err);
            });

        } else {
            res.render('layout', {
                error: 'Uh oh! No signature was saved. Please sign again!'
            });
        }

    });

module.exports = router;
