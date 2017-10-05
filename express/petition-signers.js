const redis = require('./redis');
const dbQuery = require('../sql-signers/profile');
const express = require('express');
const router = express.Router();



router.route('/signers')


    .get((req, res) => {

        if (!req.session.signatureId && !req.session.user) {

            res.redirect('/login');

        } else if (!req.session.signatureId && req.session.user) {

            res.redirect('/petition/sign');

        } else {

            redis.checkCache('getSignersBySignature', req, res);

            // dbQuery.getSignersBySignature().then((arr) => {
            //
            //     console.log(arr);
            //     var name;
            //     var age;
            //     var city;
            //     var arrUser = {};
            //     const arrUserProfile = arr.rows;
            //     console.log(arrUserProfile);
            //
            //
            //     res.render('signers', {
            //         profile: arrUserProfile
            //
            //     });
            // }).catch((err) => {
            //     console.log(err);
            // });
        }
    });


module.exports = router;
