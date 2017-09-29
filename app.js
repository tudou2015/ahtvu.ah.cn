var express = require('express'),
    path = require('path'),
    http = require('http'),
    fs = require('fs'),
    parser = require('body-parser'),
    template = require('art-template'),
    compression = require('compression'),
    utils = require('./utils/utils.js'),
    widget = require('./connect/widget');

var logger = require('tracer').console({
    transport: function (data) {
        fs.appendFile('./file.log', data.output + '\n', (err) => {
            if (err) throw err;
        });
    }
});

//node v8 升级,defer函数被废弃，为此打补丁
if (!Promise.defer) {
    Promise.defer = function () {
        var deferred = {};
        deferred.resolve = null;
        deferred.reject = null;
        deferred.promise = new Promise(function (resolve, reject) {
            this.resolve = resolve;
            this.reject = reject;
        }.bind(deferred));
        Object.freeze(deferred);
        return deferred;
    }    
}

var app = express();

app.set('port', 3000);
app.set('x-powered-by', false);
app.set('view engine', 'html');

fs.readdirSync('./themes').forEach(function (e) {

    app.set('views', path.join(__dirname, 'themes', e, 'skins'));
});

template.config('extname', '.html');

//helper
template.helper('dateFormat', utils.dateFormat);
template.helper('subString', utils.subString);

app.engine('.html', template.__express);

//parse json
app.use(parser.json());

//parse request body
app.use(parser.urlencoded({
    extended: false
}));

//gzip middleware
app.use(compression({
    level: 9
}));

//set static file path
app.use(express.static(path.join(__dirname, 'themes'), {
    maxAge: 24 * 60 * 60 * 1000
}));

//widget middleware init
app.use(widget.__init());

//load routes
fs.readdirSync('./routes').forEach(function (e) {

    e = e.replace('.js', '');
    app.use('/' + e, require('./routes/' + e));
}, this);

//widget middleware resolve function
app.use(widget.__middleware());

//handle exceptions
app.use(function (err, req, res, next) {
    console.error(err.stack);

    res.status(err.status || 500);
    res.render('error.html', {
        message: err.message
    });
});

//listen app to port
app.listen(app.get('port'), function () {
    console.log('安徽广播电视大学网站 服务启动于 %s 端口', app.get('port'));

    logger.error('安徽广播电视大学网站 服务启动于 %s 端口', app.get('port'));
});

module.exports = app;