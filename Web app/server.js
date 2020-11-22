const express = require('express');
const bodyParser = require('body-parser');
const { request } = require('http');
const requestify = require('requestify');
const app = express();
const port = 8000;

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});



require('./routes')(app, {});
app.listen(port, () => { console.log('We are live on ' + port); });
