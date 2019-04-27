'use strict';
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/';
const fs = require('fs');
const googleFinance = require('google-finance');
const util = require('util');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const bcrypt = require('bcrypt');
require('dotenv').config();

//parse requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//connect to DB
mongoose.connect(url);
const db = mongoose.connection;

//mongo error handler
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() => {
   //connected
});

//Use sessions for logins
app.use(session({
    secret: 'asdfg',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

//serve static files
app.use(express.static(__dirname + '/public'));

//routes
const routes = require('./routers/userRouter');
app.use('/', routes);

//404 => error handler
// app.use('/', (req, res, next) => {
//     const err = new Error('File not found.');
//     err.status = 404;
//     next(err)
// });

//error handler
app.use((err, res) => {
    res.status(err.status || 500);
    res.send(err.message)
});

// SSL
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert,
};

// google finance test
/*const SYMBOL = 'NASDAQ:AAPL';

googleFinance.companyNews({
   symbol: SYMBOL
}, function(err, news){
    if (err) {throw err;}
    console.log(util.format(
        '=== %s (%d) ===',
        SYMBOL,
        news.length
    ).cyan);
    if (news[0]) {
        console.log(
            '%s\n...\n%s',
            JSON.stringify(news[0], null, 2),
            JSON.stringify(news[news.length - 1], null, 2)
        );
    } else {
        console.log('N/A');
    }
});*/

// HTTPS create
https.createServer(options, app).listen(3000);

// HTTPS redirect
http.createServer((req, res)=> {
    res.writeHead(301, {'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username === process.env.username
            && bcrypt.compareSync(password, process.env.pwdhash)) {
            return done(null, { username: username });
        } else {
            done(null, false, {message: 'Incorrect credentials.'});
        }
    })
);

// data put in passport cookies needs to be serialized
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(session({
    secret: 'some s3cr3t value',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true, // only over https
        maxAge: 2 * 60 * 60 * 1000} // 2 hours
}));
app.use(passport.initialize());
app.use(passport.session());

https.createServer(sslstuff, app).listen(3000);

app.get('/', (req, res) => {
    if(req.user !== undefined)
        return res.send(`Hello ${req.user.username}!`);
    res.send('Hello Secure World!');
});

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/failed'
    })
);