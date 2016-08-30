var express = require('express'),
    path = require('path'),
    http = require('http'),
    parser = require('body-parser'),
    template = require('art-template'),
    compression = require('compression'),
    utils = require('./utils/utils.js'),
    widget = require('./connect/widget');

var app = express();

app.set('port', 3000);
app.set('x-powered-by', false);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'themes', 'default', 'skins'));

template.config('extname', '.html');

//helper
template.helper('dateFormat', utils.dateFormat);
template.helper('subString', utils.subString);

app.engine('.html', template.__express);

//parse json
app.use(parser.json());

//parse request body
app.use(parser.urlencoded({ extended: false }));

//gzip middleware
app.use(compression({ level: 9 }));

//set static file path
app.use(express.static(path.join(__dirname, 'themes', 'default'), { maxAge: 24 * 60 * 60 * 1000 }));

//widget middleware init
app.use(widget.__init());

//load routes
app.use('/', require('./routes/index'));

//widget middleware resolve function
app.use(widget.__middleware());

//handle exceptions
app.use(function (err, req, res, next) {
    console.error(err.stack);

    res.status(err.status || 500);
    res.render('error.html', { message: err.message });
});

//listen app to port
app.listen(app.get('port'), function () {
    console.log('安徽广播电视大学网站 服务启动于 %s 端口', app.get('port'));
});

module.exports = app;