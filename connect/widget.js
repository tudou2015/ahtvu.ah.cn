var path = require('path'),
    fs = require('fs'),
    template = require('art-template'),
    async = require('async'),
    utils = require('../utils/utils'),
    request = require('request'),
    config = require('../config.js');

const util = require('util');
const reg = new RegExp(/<widget id="(\w*)"\s?><\/widget>/gmi);

if (config.debug) { //方便调试,不缓存模版，每次都从widget html生成新模版
    template.defaults.cache = false;
}

var widget = {
    __init: function () {
        return function (req, res, next) {

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
            }, function (error, response, body) {

                if (!!error) {

                    console.log('can not find any site info');
                    next();
                    return;
                }

                //get current site info
                body = JSON.parse(body);

                if (body.code < 0) {

                    if (config.debug) {//调试时输出
                        console.log(req.url + ',' + body.msg);
                    }
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

    __middleware: function () {
        return function (req, res, next) {

            //if need render html with widget
            if (!res.context || !res.context._r_widget) {

                next();
                return;
            }

            var skin = path.join(req.app.site.paths.skins, res.context._r_widget_skin);

            //read the skin file
            fs.readFile(skin, 'utf8', (err, data) => {

                if (err) {
                    //throw err;                    
                    console.log(req.url + ',' + err.message);
                    res.end('skin not found');
                    return;
                }

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
                            try {

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
                                    fs.accessSync(_w_js, fs.R_OK);
                                } catch (error) {
                                    //console.log(req.url +',' + error.message);

                                    //data = data.replace(e.holder, template.renderFile(_w_html, result));
                                    var content = template.renderFile(_w_html, result);
                                    callback(null, {
                                        error: '',
                                        holder: e.holder,
                                        content: content
                                    });

                                    return;
                                }


                                //get data from data.js
                                if (config.debug) { //方便调试,每次都加载js
                                    delete require.cache[_w_js];
                                }

                                require(_w_js)(req, res, utils).then(function (r) {

                                    r.site = req.app.site;
                                    r._widget_name = result._widget_name;
                                    r._widget_path = result._widget_path;

                                    //低效代码，阻碍并行执行
                                    //template html & replace 
                                    //data = data.replace(e.holder, template.renderFile(_w_html, r));
                                    var content = template.renderFile(_w_html, r);
                                    //传给回调更多参数，方便处理
                                    callback(null, {
                                        error: content == '{Template Error}'?content:'',
                                        holder: e.holder,
                                        content: content
                                    });
                                }).catch(function (error) {

                                    //console.log(error.stack);
                                    //传给回调更多参数，方便处理
                                    callback(null, {
                                        error: error.message,
                                        holder: e.holder,
                                        content: error.message
                                    });
                                });

                            } catch (error) {

                                console.error('render widget error: %s', error.stack);
                                //传给回调更多参数，方便处理
                                callback(null, {
                                    error: 'data.js parse error',
                                    holder: e.holder,
                                    content: error.message
                                });
                            }

                        });

                    }, this);

                    async.parallel(runs, function (err, result) {
                        //低效代码
                        //res.send(template(skin, data)({}));
                        //处理错误
                        result.forEach(function (e) {
                                if (e.error) { //出错，输出url，方便跟踪调试
                                    console.log(req.url + ',' + e.error);
                                }
                                
                                //替换占位符
                                data = data.replace(e.holder, e.content);
                            }

                        );
                        //发送最终结果
                        res.send(data);
                    });
                });
            });
        }
    }
};

module.exports = widget;