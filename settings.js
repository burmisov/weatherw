module.exports = {

    owmApiUrl: process.env.WEATHERW_OWM_API_URL ||
        "http://api.openweathermap.org/data/2.5/forecast/daily",

    redisPort: process.env.WEATHERW_REDIS_PORT || 6379,
    redisHost: process.env.WEATHERW_REDIS_HOST || '127.0.0.1',
    redisPass: process.env.WEATHERW_REDIS_PASS || '',

    cacheTTLseconds: process.env.WEATHERW_CACHE_TTL || (1 * 60 * 60),

    widgetBaseUrl: process.env.WEATHERW_WIDGET_BASE_URL ||
        "http://localhost:4000/widget"
};
