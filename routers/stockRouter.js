const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const symbol = 'MSFT';
const apiurl = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol='+symbol+'&interval=5min&apikey='+process.env.api_key;

/*
const pos = apiurl.lastIndexOf(symbol);
/*
const input = document.createElement("INPUT");
input.setAttribute("type", "text");

let userinput = input;
// replace api query symbol string with that of users input
// jsdom not working in Node.js!!!!
pos.replace("symbol", userinput);
*/

router.get('/', (req, res) => {
    fetch(apiurl)
        .then(response => response.json())
        .then(json => res.json(json));
        res.render('stock', {title: 'Stock Information', message: res.json.symbol})
});

module.exports = router;