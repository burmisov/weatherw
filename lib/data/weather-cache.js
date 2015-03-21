module.exports = {
    put: putWeatherToCache,
    get: getWeatherFromCache
};

var debug = require('debug')('weatherw:w-cache');

var redis = require('redis');

var settings = require('../../settings');

debug('connecting to redis server');

var redisClient = redis.createClient(
    settings.redisPort,
    settings.redisHost,
    { auth_pass: settings.redisPass }
);

redisClient.on("error", function (err) {
    console.error("Redis client error>", err);
    debug('Redis client error', err);
    throw err;
});

/*
    query: {
        cityCode: 'code',
        timeSpan: '1d' // 1d | 3d | 7d
    }
*/
function putWeatherToCache(query, weatherData, callback) {
    var cacheKey = queryToRedisKey(query);
    debug('caching weather for', cacheKey);
    var data = JSON.stringify(weatherData);
    redisClient.set(cacheKey, data, function (err) {
        if (err) { return callback(err); }
        debug('cached ok', cacheKey);
        redisClient.expire(cacheKey, settings.cacheTTLseconds, callback);
    });
}

function getWeatherFromCache (query, callback) {
    var cacheKey = queryToRedisKey(query);
    debug('retreiving cached weather for', cacheKey);
    redisClient.get(cacheKey, function (err, data) {
        if (err) { return callback(err); }
        debug('got cached result', !!data);
        return callback(null, JSON.parse(data));
    });
}

function queryToRedisKey (query) {
    return ('weather_' + query.cityCode + '_' + query.timeSpan);
}
