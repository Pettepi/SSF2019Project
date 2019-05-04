const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', (req, res) => {
    fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey='+process.env.api_key)
        .then(response => response.json())
        .then(json => res.json(json));
});

module.exports = router;