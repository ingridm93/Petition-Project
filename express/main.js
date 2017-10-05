const express = require('express');
const app = express();
const hb = require('express-handlebars');
app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
const sql = require('./sql-signers/sql-signers');
const addSignature = sql.addSignature;
const getSignatureById = sql.getSignatureById;
const signatureCount = sql.signatureCount;
const sqlPass = require('./sql-signers/login');
const hashPassword = sqlPass.hashPassword;
const checkPassword = sqlPass.checkPassword;
const addUser = sqlPass.addUser;
const getUserByEmail = sqlPass.getUserByEmail;
const getSigners = sqlPass.getSigners;





app.use(express.static(__dirname + '/public'));

app.get('/petition/sign', (req, res) => {

    const { first, last, id } = req.session.user;

    getSignatureById(id)

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

});

app.get('/petition/signed', (req, res) => {

    const { first, last } = req.session.user;

    if (req.session.signatureId) {


        Promise.all([
            getSignatureById(req.session.signatureId),
            signatureCount()
        ])
        .then((arr) => {

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
        })
        .catch((err) => {
            console.log(err);
        });

    } else {
        res.redirect('/petition/sign');
    }
});




app.get('/petition/sign', (req, res) => {

    const {first, last, id } = req.session.user;

    getSignatureById(id)
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

});

app.get('/petition/signers', (req, res) => {

    if (!req.session.signatureId) {

        res.redirect('/petition/sign');

    } else {

        getSignatureById(req.session.user.id)

        .then((result) => {

            if (result.rows[0].signature) {

                getSigners()
                .then((result) => {
                    var name;
                    var arrName = [];
                    const arr = result.rows;
                    arr.forEach((obj) => {
                        name = `${obj.first} ${obj.last}`;
                        arrName.push(name);
                    });
                    console.log(arrName);
                    return arrName;

                })
                .then((name) => {
                    res.render(('signers'), {
                        row: name
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        });
    }

});



app.listen(3000, () => {
    console.log('listening');

});
