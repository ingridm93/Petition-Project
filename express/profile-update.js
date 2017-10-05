const express = require('express');
const router = express.Router();

const dbQuery = require('../sql-signers/profile');
const dbLogin = require('../sql-signers/login');

const csrf = require('csurf');
const csrfProtect = csrf();


router.route('/update')
    .all(csrfProtect)


    .get((req, res) => {


        if (!req.session.user) {

            res.redirect('/login');

        } else {

            dbQuery.getUserProfile(req.session.user.id)

            .then((result) => {
                const profile = result.rows[0];
                console.log(profile);

                res.render('profile-edit', {
                    first: profile.first,
                    last: profile.last,
                    email: profile.email,
                    age: profile.age,
                    city: profile.city,
                    homepage: profile.homepage,
                    csrfToken: req.csrfToken()
                });

            })
            .catch((err) => {
                console.log(err);
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
        if (!req.body.homepage) {
            req.body.homepage = null;
        }

        if (req.body.password) {

            dbLogin.hashPassword(req.body.password)

            .then((hash) => {
                dbLogin.updatePassword(hash, req.session.user.id);

            })
            .catch((err) => {
                console.log(err);
            });
        }

        dbQuery.updateUserProfile(req.body.age, req.body.city, req.body.homepage, req.session.user.id)

        .then(() => {

            return dbQuery.updateUserInfo(req.body.first, req.body.last, req.body.email, req.session.user.id);
        })
        .then((name) => {

            req.session.user.first = name.first;
            req.session.user.last = name.last;

            console.log(req.session.user.first);

            res.redirect('/profile/update');

        });
    });




module.exports = router;
