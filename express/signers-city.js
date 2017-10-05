const express = require('express');
const router = express.Router();
const dbQuery = require('../sql-signers/profile');


router.route('/signers/:city')

    .get((req, res) => {

        if (!req.session.signatureId && !req.session.user) {
            res.redirect('/login');
        } else {

            const city = req.params.city;

            dbQuery.getSignersByCity(city)

            .then((arr) => {


                const info = arr.rows;

                res.render('signers-by-city', {
                    city: city,
                    signersByCity: info
                });
            })
           .catch((err) => {
                console.log(err);
            });
        }
    });



module.exports = router;
