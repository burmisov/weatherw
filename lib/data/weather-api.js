module.exports = {
    get: getWeatherFromAPI
};

var debug = require('debug')('weatherw:owm-api');

var request = require('request');
var _ = require('lodash');

var settings = require('../../settings');
var places = require('./places');

/*
    query: {
        cityCode: 'code',
        timeSpan: '1d' // 1d | 3d | 7d
    }

    callback(err, {
        forecast: [
            {
                date: Date,
                temp: { day: 11.43, night: 6.61, eve: 9.45, morn: 11.43 },
                pressure: 1000.94,
                humidity: 72,
                icon: "04d"
            }
            , ..., { ... }
        ]
    })
*/
function getWeatherFromAPI (query, callback) {
    debug('getting weather for', query);

    var daysCount = timeSpanToDaysCount(query.timeSpan);
    places.getByCode(query.cityCode, function (err, place) {
        if (err) { return callback(err); }

        debug('got place data', place);

        // Доки: http://openweathermap.org/forecast
        request.get({
            url: settings.owmApiUrl,
            qs: {
                lat: place.lat,
                lon: place.lon,
                cnt: daysCount,
                units: 'metric'
            },
            json: true
        }, function (err, response, body) {
            if (err) { return callback(err); }

            if (response.statusCode === 200) {
                debug('weather api response ok');
                var weatherData = owmResponseToWeatherData(body);
                return callback(null, weatherData);
            } else {
                debug('weather api response error');
                return callback(new Error("API response error"));
            }
        });
    });
}

function timeSpanToDaysCount (timeSpan) {
    switch (timeSpan) {
        case '1d':
            return 2;
        case '3d':
            return 4;
        case '7d':
            return 8;
        default:
            console.error('Unknown timespan:', timeSpan);
            return 2;
    }
}

function owmResponseToWeatherData (owmResponse) {

    function transformOneDay (owmDay) {
        return {
            date: (new Date(owmDay.dt * 1000)).toISOString(),
            temp: _.pick(owmDay.temp, ['day', 'night', 'eve', 'morn']),
            pressure: owmDay.pressure,
            humidity: owmDay.humidity,
            icon: owmDay.weather[0].icon
        };

    }
    // Берём данные со второго дня (с завтра)
    return owmResponse.list.slice(1).map(transformOneDay);
}
