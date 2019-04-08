'use strict';
const express = require('express');
const app = express();
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/';
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(url, {useNewUrlParser: true}).then(()=>{
    console.log('connected succesfully');
    app.listen(3000);
}, err => {
    console.log('connection to database failed' + err);
});