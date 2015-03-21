var _ = require('lodash');
var express = require('express');
var path = require('path');

var renderWidget = require('./render-widget');
var getWeather = require('../data/get-weather');

var router = module.exports = express.Router();

var imagesPath = path.join(process.cwd(), 'lib/widget/images');

router.use('/images', express.static(imagesPath, {
    maxAge: '14d'
}));

router.get('/get', function (req, res) {
    if (!req.query.cityCode) {
        return res.status('400').send('Bad request');
    } else {
        getWeather({
            cityCode: req.query.cityCode,
            timeSpan: '1d'
        }, function (err, data) {
            if (err) { return res.status('500').send(err.message); }

            res.status(200).send(renderWidget.inner(_.extend(data, {
                cityCode: req.query.cityCode
            })));
        });
    }
});

// --- ВРЕМЕННО ДЛЯ ОТЛАДКИ ---
router.get('/get-embed-code', function (req, res) {
    if (!req.query.cityCode) {
        return res.status('400').send('Bad request');
    } else {
        res.status(200).send(renderWidget.embed({
            cityCode: req.query.cityCode
        }));
    }
});
