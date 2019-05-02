'use strict';
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fs = require('fs');
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
db.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}:${process.env.DB_PORT}/test`, app);
app.use ((req, res, next) => {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
});

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