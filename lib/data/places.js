module.exports = {

    // Имитируем асинхронную работу, чтобы потом
    // было легче заменить на работу с какой-нибудь БД

    getAll: function (callback) {
        setImmediate(function () {
            return callback(null, data);
        });
    },

    getByCode: function (code, callback) {
        setImmediate(function () {
            return callback(null, data[code]);
        });
    }

};

var data = {

    "code1m": {
        name: "Москва",
        lat: 55.751667,
        lon: 37.617778
    },

    "code2p": {
        name: "Санкт-Петербург",
        lat: 59.95,
        lon: 30.316667
    },

    "code3n": {
        name: "Нижний Новгород",
        lat: 56.3112,
        lon: 43.9308
    }

};
