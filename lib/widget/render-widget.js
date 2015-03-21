module.exports = renderWidgetToString;

var debug = require('debug')('weatherw:render-w');

var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var settings = require('../../settings');

debug('preparing widget template render function');

var widgetTemplatePath = path.join(process.cwd(), 'views/widget/widget.ejs');
var widgetTemplateString = fs.readFileSync(widgetTemplatePath, { encoding: 'utf8' });
var widgetTemplate = ejs.compile(widgetTemplateString, {
    filename: widgetTemplatePath,
    rmWhitespace: true
});

debug('widget render prepared');

function renderWidgetToString (widgetOptions) {
    return widgetTemplate(enrichWidgetOptions(widgetOptions));
}

function enrichWidgetOptions (widgetOptions) {
    widgetOptions.weather = widgetOptions.weather.map(function (weatherDay) {
        var today = new Date();

        var date = new Date(weatherDay.date);
        var month = date.getMonth() + 1;
        if (month < 10) { month = '0' + month; }
        var dayOfMonth = date.getDate();
        if (dayOfMonth < 10) { dayOfMonth = '0' + dayOfMonth; }
        weatherDay.shortDate = dayOfMonth + '.' + month;

        var daysToDate = (new Date(date - today)).getDate();
        switch (daysToDate) {
            case 0: weatherDay.dayName = "Сегодня"; break;
            case 1: weatherDay.dayName = "Завтра"; break;
            case 2: weatherDay.dayName = "Послезавтра"; break;
            default: weatherDay.dayName = "";
        }

        var tempWithSigns = {};
        Object.keys(weatherDay.temp).forEach(function (tempKey) {
            var temp = weatherDay.temp[tempKey];
            tempWithSigns[tempKey + 'WithSign'] =
                ( temp > 0 ? '-' : '+' ) + Math.round(temp)
            ;
        });

        weatherDay.temp = _.extend(weatherDay.temp, tempWithSigns);

        weatherDay.iconUrl =
            settings.widgetBaseUrl + "/images/" + weatherDay.icon + ".png"
        ;

        return weatherDay;
    });

    return widgetOptions;
}
