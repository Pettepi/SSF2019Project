'use strict';
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:30000/';
const fs = require('fs');
const googleFinance = require('google-finance');
const util = require('util');
require('dotenv').config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// SSL
const sslkey = fs.readFileSync('ssl-key.pem');
const sslcert = fs.readFileSync('ssl-cert.pem');

const options = {
    key: sslkey,
    cert: sslcert,
};

https.createServer(options, app).listen(3000);

// google finance test
const SYMBOL = 'NASDAQ:AAPL';

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
});

// HTTPS redirect
http.createServer((req, res)=> {
    res.writeHead(301, {'Location': 'https://localhost:3000' + req.url });
    res.end();
}).listen(8080);

// MongoDB server initialization
mongoose.connect(url, options, {useNewUrlParser: true}).then(()=>{
    console.log('connected succesfully');
    app.get('/', (req, res) => {
        res.send('Security works')
    });
    app.listen(3000);
}, err => {
    console.log('connection to database failed' + err);
});