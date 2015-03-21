var render = module.exports = {
    // Формируется динамически
};

var debug = require('debug')('weatherw:render-w');

var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var uuid = require('uuid');

var settings = require('../../settings');

var renderers = {
    'full': {
        template: 'widget-full'
    },
    'embed': {
        template: 'wrapper'
    },
    'inner': {
        template: 'widget-inner'
    }
};

debug('preparing widget template renderers');

Object.keys(renderers).forEach(function (rendererKey) {
    var renderer = renderers[rendererKey];

    var widgetTemplatePath = path.join(process.cwd(), "views/widget/" + renderer.template + ".ejs");
    var widgetTemplateString = fs.readFileSync(widgetTemplatePath, { encoding: 'utf8' });
    var widgetTemplate = ejs.compile(widgetTemplateString, {
        filename: widgetTemplatePath,
        rmWhitespace: true
    });

    render[rendererKey] = function (widgetOptions) {
        return widgetTemplate(enrichWidgetOptions(widgetOptions));
    };
});

debug('widget render prepared');

function enrichWidgetOptions (widgetOptions) {
    widgetOptions.widgetId = 'weatherw-' + uuid.v4();
    widgetOptions.baseUrl = settings.widgetBaseUrl + "/get";

    if (widgetOptions.weather) {
        widgetOptions.weather = widgetOptions.weather.map(function (weatherDay, idx) {
            var today = new Date();

            var date = new Date(weatherDay.date);
            var month = date.getMonth() + 1;
            if (month < 10) { month = '0' + month; }
            var dayOfMonth = date.getDate();
            if (dayOfMonth < 10) { dayOfMonth = '0' + dayOfMonth; }
            weatherDay.shortDate = dayOfMonth + '.' + month;

            switch (idx) {
                case 0: weatherDay.dayName = "Завтра"; break;
                case 1: weatherDay.dayName = "Послезавтра"; break;
                default: weatherDay.dayName = "";
            }

            var tempWithSigns = {};
            Object.keys(weatherDay.temp).forEach(function (tempKey) {
                var temp = weatherDay.temp[tempKey];
                tempWithSigns[tempKey + 'WithSign'] =
                    ( temp < 0 ? '–' + Math.round(Math.abs(temp)) : '+' + Math.round(temp) )
                ;
            });

            weatherDay.temp = _.extend(weatherDay.temp, tempWithSigns);

            weatherDay.iconUrl =
                settings.widgetBaseUrl + "/images/" + weatherDay.icon + ".png"
            ;

            return weatherDay;
        });
    }

    return widgetOptions;
}
