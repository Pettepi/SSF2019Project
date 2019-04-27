const request = require('request');

module.exports = (app) => {
    app.post('/stocks', (req, res) => {
        request('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=N7T23GK2RRMG28XS', (error, response, body) => {

            const content = JSON.parse(body);
            console.log(content['Meta Data']);
            console.log('error', error);
            console.log('body', body);

            res.send({
                success: true,
                message: 'works',
                stockInfo: content['Meta Data']['Time Series (5min)']
            })
        });
    })
};