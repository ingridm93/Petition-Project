const express = require('express');
const router = express.Router();
const dbQuery = require('../sql-signers/sql-signers');
const redis = require('./redis');


router.route('/delete')

    .get((req, res) => {

        if (!req.session.user) {
            res.redirect('/login');
        } else {

            dbQuery.getSignatureById(req.session.user.id)
            .then((result) => {

                if (!result.rows[0]) {
                    res.render('layout', {
                        first: req.session.user.first,
                        last: req.session.user.last
                    });
                } else {

                    req.session.signatureId = req.session.user.id;

                    dbQuery.getSignatureById(req.session.signatureId)
                    .then((sig) => {

                        const signature = sig.rows[0].signature;

                        res.render('delete', {
                            first: req.session.user.first,
                            last: req.session.user.last,
                            signature: signature
                        });

                    });

                }
            })
            .catch((err) => {
                console.log(err);
            });
        }

    })

    .post((req, res) => {

        dbQuery.deleteSignature(req.session.user.id)
        .then(() => {
            redis.delCache('signers');
            res.redirect('/petition/sign');
            console.log(req.session.user.id);

        });
    });

module.exports = router;
