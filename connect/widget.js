var path = require('path'),
    fs = require('fs'),
    template = require('art-template'),
    async = require('async'),
    utils = require('../utils/utils');

const util = require('util');
const reg = new RegExp(/<widget id="(\w*)"\s?><\/widget>/gmi);

var widget = {
    __init: function () {
        return function (req, res, next) {

            if (!req.context) req.context = {};

            //get current site info TODO
            req.context.site = {
                id: '8-dnag6m9znkhvyqnm-q-w',
                title: '安徽广播电视大学',
                logo: '',
                domain: 'www.ahtvu.ah.cn',
                key_words: '安徽广播电视大学 广播电视大学',
                description: '安徽广播电视大学',
                theme: 'default'
            };

            //set the theme,widget,skins paths
            var theme = path.join(__dirname, '../', 'themes', req.context.site.theme || 'default');

            req.context.paths = {
                theme: theme,
                skins: path.join(theme, 'skins'),
                widget: path.join(theme, 'widgets')
            };

            next();
        }
    },

    __middleware: function () {
        return function (req, res, next) {

            if (res.context && res.context._r_widget) {

                var skin = path.join(req.context.paths.skins, res.context.skin);

                //read the skin file
                fs.readFile(skin, 'utf8', (err, data) => {

                    if (err) throw err;

                    //get all page widgets
                    var widgets = [],
                        temp = {},
                        runs = [],
                        widget_ids = [];

                    while ((temp = reg.exec(data)) !== null) {

                        widgets.push({ holder: temp[0], id: temp[1] });

                        widget_ids.push(temp[1]);
                    }

                    //get all widget from server
                    utils.request({
                        url: 'open/get_widgets',
                        method: 'POST',
                        qs: { siteId: req.context.site.id, ids: widget_ids }
                    }, function (result) {

                        if (result.code != 200) throw new Error();

                        var body = JSON.parse(result.body);

                        if (body.code != 1) throw new Error();

                        //execute widget's data.js & template with data
                        widgets.forEach(function (e) {

                            var _w_real = body.widgets.filter(function (a) {
                                return a.container_id == e.id;
                            });

                            if (_w_real.length == 0) return;

                            _w_real = _w_real[0];

                            runs.push(function (callback) {

                                var _w_path = path.join(req.context.paths.widget, _w_real.name),
                                    _w_js = path.join(_w_path, 'data.js'),
                                    _w_html = path.join(_w_path, 'view');

                                try {

                                    //check data.js file 
                                    fs.accessSync(_w_js, fs.R_OK | fs.R_OK);
                                } catch (error) {

                                    data = data.replace(e.holder, template.renderFile(_w_html, {}));
                                    callback();

                                    return;
                                }

                                try {

                                    //get data from data.js
                                    require(_w_js)(req, res, utils).then(function (result) {

                                        //add current widget id to result
                                        result._widget_name = _w_real.name;
                                        result._widget_path = util.format('widgets/%s', _w_real.name);

                                        //template html & replace 
                                        data = data.replace(e.holder, template.renderFile(_w_html, result));
                                        callback();
                                    }).catch(function (error) {

                                        console.log(error.stack);
                                        callback();
                                    });

                                } catch (error) {

                                    console.error('render widget error: %s', error.stack);
                                    callback();
                                }
                            });

                        }, this);

                        async.parallel(runs, function () {
                            res.send(template(skin, data)({}));
                        });
                    });
                });
            }
        }
    }
};

module.exports = widget;