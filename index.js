'use strict';
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:30000/';
const fs = require('fs');
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