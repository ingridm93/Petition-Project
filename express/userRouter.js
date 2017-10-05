const dbQuery = require('../sql-signers/login');
const dbProfile = require('../sql-signers/profile');
const redis = require('./redis');
const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const csrfProtect = csrf();



router.route('/')



    .get((req, res) => {

        res.redirect('/registration');

    });

router.route('/registration')

    .all(csrfProtect)

    .get((req, res) => {

        res.render('registration', {
            csrfToken: req.csrfToken()

        });

        console.log(req.csrfToken());

    })


    .post((req, res) => {

        const { first, last, email, password } = req.body;

        if (first && last && email && password) {

            dbQuery.hashPassword(password)
            .then((hash) => {

                return dbQuery.addUser(email, hash, first, last)

            })
            .then((result) => {

                req.session.user = {
                    id: result.rows[0].id,
                    first: result.rows[0].first,
                    last: result.rows[0].last
                };

                res.redirect('/profile');
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            res.render('registration', {

                error: 'Uh oh! Seems like not all information was provided accordingly.'
            });
        }
    });


router.route('/login')

    .all(csrfProtect)

    .get((req, res) => {

        res.render('login', {
            csrfToken: req.csrfToken()
        });

    })


    .post((req, res) => {
        const { email, password } = req.body;

        if (email && password) {

            dbQuery.getUserByEmail(email)
            .then((userData) => {

                return dbQuery.checkPassword(password, userData.rows[0].password)
            })
            .then((doesMatch) => {

                if (!doesMatch) {
                    throw 'Password is invalid.';
                } else {
                    req.session.user = {
                        id: userData.rows[0].id,
                        first: userData.rows[0].first,
                        last: userData.rows[0].last,
                        email: userData.rows[0].email,
                        hashedPassword: userData.rows[0].password
                    };

                    res.redirect('/petition/sign');
                }

            })
            .catch((err) => {
                console.log(err);
            });
        } else {

            res.render('login', {

                error: 'The e-mail or password entered is invalid. Please try again.'
            });
        }

    });


router.route('/profile')

    .all(csrfProtect)

    .get((req, res) => {

        if (!req.session.user) {
            res.redirect('/login');
        } else {
            res.render('profile', {
                csrfToken: req.csrfToken()
            });
        }
    })

    .post((req, res) => {

        if (!req.body.age) {
            req.body.age = null;
        }
        if (!req.body.city) {
            req.body.city = null;
        }
        if (!req.body.homepageage) {
            req.body.homepage = null;
        }

        dbProfile.addProfileInfo(req.session.user.id, req.body.age, req.body.city, req.body.homepage)
        .then(() => {

            redis.delCache('profiles');
        });

        res.redirect('/petition/sign');

    });




router.route('/logout')

    .get((req, res) => {

        req.session.destroy();

        res.redirect('/registration');
    });


module.exports = router;
