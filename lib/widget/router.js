var express = require('express');
var path = require('path');

var router = module.exports = express.Router();

var imagesPath = path.join(process.cwd(), 'lib/widget/images');

router.use('/images', express.static(imagesPath, {
    maxAge: '14d'
}));
