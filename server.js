const express = require('express');
const app = express();
const hb = require('express-handlebars');
const userRouter = require('./express/userRouter');
const petitionSign = require('./express/petition-sign');
const petitionSigned = require('./express/petition-signed');
const petitionSigners = require('./express/petition-signers');
const signersByCity = require('./express/signers-city');
const deleteSignature = require('./express/delete-signature');
const updateProfile = require('./express/profile-update');





app.engine('handlebars', hb());
app.set('view engine', 'handlebars');


// app.use(require('cookie-session')({
//     secret: 'nobody will ever figure this out',
//     maxAge: 1000 * 60 * 60 * 24 * 14
// }));



var session = require('express-session');
var Store = require('connect-redis')(session);

app.use(session({
    store: new Store({
        ttl: 3600,
        host: 'localhost',
        port: 6379
    }),
    resave: false,
    saveUninitialized: true,
    secret: 'nobody will ever figure this out'
}));


app.use(require('body-parser').urlencoded({
    extended: false
}));


app.use(express.static(__dirname + '/public'));


app.use('/', userRouter);
app.use('/profile', updateProfile);
app.use('/petition', petitionSign);
app.use('/petition', petitionSigned);
app.use('/petition', petitionSigners);
app.use('/petition', deleteSignature);
app.use('/petition', signersByCity);



app.listen(3000, () => {
    console.log('listening');

});
