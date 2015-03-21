module.exports = renderWidgetToString;

var debug = require('debug')('weatherw:render-w');

var ejs = require('ejs');
var path = require('path');
var fs = require('fs');

debug('preparing widget template render function');

var widgetTemplatePath = path.join(process.cwd(), 'views/widget/widget.ejs');
var widgetTemplateString = fs.readFileSync(widgetTemplatePath, { encoding: 'utf8' });
var widgetTemplate = ejs.compile(widgetTemplateString, {
    filename: widgetTemplatePath
});

debug('widget render prepared');

function renderWidgetToString (widgetOptions) {
    return widgetTemplate(widgetData);
}
