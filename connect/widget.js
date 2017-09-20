var path = require('path'),
    fs = require('fs'),
    template = require('art-template'),
    async = require('async'),
    utils = require('../utils/utils'),
    request = require('request'),
    config = require('../config.js');

const util = require('util');
const reg = new RegExp(/<widget id="(\w*)"\s?><\/widget>/gmi);

var widget = {
    __init: function() {
        return function(req, res, next) {

            var domain = req.hostname,
                tmp = req.path.substr(1).split('/')[0];

            if (tmp.length > 0) domain = tmp;
            if (tmp.indexOf('.') > -1) {

                next();
                return;
            }

            if (!req.app.caches) req.app.caches = {};

            //get site from caches
            if (domain && req.app.caches[domain]) {

                req.app.site = req.app.caches[domain];

                next();
                return;
            }

            request({
                uri: 'open/get_site_info',
                baseUrl: util.format('%s/', config.cms.origin()),
                method: 'POST',
                qs: {
                    domain: domain
                },
                useQuerystring: true
            }, function(error, response, body) {

                if (!!error) {

                    console.log('can not find any site info');
                    next();
                    return;
                }

                //get current site info
                body = JSON.parse(body);

                if (body.code < 0) {

                    console.log(req.path + ',' + domain + ',' + body.msg);
                    next();
                    return;
                }

                req.app.site = body.data;

                //set the theme,widget,skins paths
                var theme = path.join(__dirname, '../', 'themes', req.app.site.theme || 'default');

                req.app.site.paths = {
                    theme: theme,
                    skins: path.join(theme, 'skins'),
                    widget: path.join(theme, 'widgets')
                };

                req.app.caches[domain] = req.app.site;

                next();
            });
        }
    },

    __middleware: function() {
        return function(req, res, next) {

            //if need render html with widget
            if (!res.context || !res.context._r_widget) {
                
                next();
                return;
            }

            var skin = path.join(req.app.site.paths.skins, res.context._r_widget_skin);

            //read the skin file
            fs.readFile(skin, 'utf8', (err, data) => {

                if (err) throw err;

                //get all page widgets
                var widgets = [],
                    temp = {},
                    runs = [],
                    widget_ids = [];

                while ((temp = reg.exec(data)) !== null) {

                    widgets.push({
                        holder: temp[0],
                        id: temp[1]
                    });

                    widget_ids.push(temp[1]);
                }

                //get all widget from server
                utils.request({
                    url: 'open/get_widgets',
                    method: 'POST',
                    qs: {
                        siteId: req.app.site.id,
                        ids: widget_ids
                    }
                }, function(result) {

                    if (result.code != 200) throw new Error();

                    var body = JSON.parse(result.body);

                    if (body.code != 1) throw new Error();

                    //execute widget's data.js & template with data
                    widgets.forEach(function(e) {

                        var _w_real = body.widgets.filter(function(a) {
                            return a.container_id == e.id;
                        });

                        if (_w_real.length == 0) return;

                        _w_real = _w_real[0];

                        runs.push(function(callback) {

                            var _w_path = path.join(req.app.site.paths.widget, _w_real.name),
                                _w_js = path.join(_w_path, 'data.js'),
                                _w_html = path.join(_w_path, 'view');

                            //add current widget name to result
                            var result = {
                                site: req.app.site,
                                _widget_name: _w_real.name,
                                _widget_path: util.format('widgets/%s', _w_real.name)
                            };

                            try {

                                //check data.js file 
                                fs.accessSync(_w_js, fs.R_OK | fs.R_OK);
                            } catch (error) {

                                data = data.replace(e.holder, template.renderFile(_w_html, result));
                                callback();

                                return;
                            }

                            try {

                                //get data from data.js
                                require(_w_js)(req, res, utils).then(function(r) {

                                    r.site = req.app.site;
                                    r._widget_name = result._widget_name;
                                    r._widget_path = result._widget_path;

                                    //template html & replace 
                                    data = data.replace(e.holder, template.renderFile(_w_html, r));
                                    callback();
                                }).catch(function(error) {

                                    console.log(error.stack);
                                    callback();
                                });

                            } catch (error) {

                                console.error('render widget error: %s', error.stack);
                                callback();
                            }
                        });

                    }, this);

                    async.parallel(runs, function() {
                        res.send(template(skin, data)({}));
                    });
                });
            });
        }
    }
};

module.exports = widget;