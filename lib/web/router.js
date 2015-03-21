var express = require('express');

var router = module.exports = express.Router();

router.get('/', function (req, res) {
    res.send('Hello from weather-widget!');
});
