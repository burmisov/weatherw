var express = require('express');
var htmlmin = require('htmlmin');

var router = module.exports = express.Router();

var places = require('../data/places');
var renderWidget = require('../widget/render-widget');

router.get('/', function (req, res) {
    places.getAll(function (err, allPlaces) {
        var widgets = Object.keys(allPlaces).map(function (cityCode) {
            var widgetOptions = {
                cityCode: cityCode,
                timeSpan: '1d'
            };

            return {
                place: allPlaces[cityCode],
                embedCode: htmlmin(renderWidget.embed(widgetOptions))
            };
        });

        res.render('home', { widgets: widgets });
    });
});
