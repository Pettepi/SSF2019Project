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
const MongoStore = require('connect-mongo')(session);
const request = require('request');
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

//listen 3000
app.listen(3000, function () {
    console.log('Listening on port 3000')
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
//https.createServer(options, app).listen(3000);

// HTTPS redirect
http.createServer((req, res)=> {
    res.writeHead(301, {'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);
