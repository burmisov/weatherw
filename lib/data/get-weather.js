module.exports = getWeather;

var debug = require('debug')('weatherw:w-get');

var weatherCache = require('./weather-cache');
var weatherAPI = require('./weather-api');

/*
    query: {
        cityCode: 'code',
        timeSpan: '1d' // 1d | 3d | 7d
    }
*/
function getWeather (query, callback) {
    debug('getting weather for', query);
    weatherCache.get(query, function (err, cachedData) {
        if (err) { return callback(err); }

        if (cachedData) {
            debug('cache hit');
            return callback(null, cachedData);
        } else {
            debug('cache miss, requesting api');
            weatherAPI.get(query, function (err, weatherData) {
                if (err) { return callback(err); }

                debug('api response ok, caching');
                // todo: Можно не дожидаться ответа кэша перед возвратом
                //       результата
                weatherCache.put(query, weatherData, function (err) {
                    if (err) { return callback(err); }

                    debug('reponse cached');
                    return callback(null, weatherData);
                });
            });
        }
    });
}
