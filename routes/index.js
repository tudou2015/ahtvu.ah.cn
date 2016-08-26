var express = require('express'),
    router = express.Router(),
    config = require('../config.js'),
    utils = require('../utils/utils'),
    async = require('async'),
    moment = require('moment');

const util = require('util');

//首页
router.get('/', function (req, res, next) {

    //set context
    if (!res.context) res.context = {};

    res.context._r_widget = true;
    res.context.skin = 'index.html';

    next();
});

router.get('/design', function (req, res) {

    res.render('design');
});

//列表页
router.get('/category', function (req, res) {

    var data = {},
        https = {
            notice: function (callback) {
                request(config.url + '/cms_api/post/postsByCategory', {
                    qs: {
                        siteId: config.site,
                        categoryId: config.categories.jxgg.id,
                        pageSize: 5
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        data.notice = [];
                        body = JSON.parse(body);
                        body.data.forEach(function (e) {

                            data.notice.push({
                                title: e.title,
                                id: e.id
                            });

                        }, this);

                        callback();
                    }
                });
            },
            detail: function (callback) {
                request(config.url + '/cms_api/post/postsByCategory', {
                    qs: {
                        siteId: config.site,
                        categoryId: req.query.id,
                        page: req.query.page - 1 || 0,
                        pageSize: 10
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        data.detail = [];
                        body = JSON.parse(body);
                        body.data.forEach(function (e) {

                            data.detail.push({
                                title: e.title,
                                date: e.dateCreated,
                                id: e.id
                            });

                        }, this);

                        for (p in config.categories) {

                            if (config.categories[p].id == req.query.id) data.bigTitle = config.categories[p].title;
                        };

                        data.totalCount = body.totalCount;
                        data.page = body.page;
                        data.pageSize = 10;
                        callback();
                    }
                });
            }, userInfo: function (callback) {

                request.post({
                    url: config.url + '/portal_api/user/userInfo',
                    headers: {
                        'Cookie': req.headers.cookie
                    }
                }, function (error, response, body) {

                    data.user = {};

                    if (!error && response.statusCode == 200) {

                        body = JSON.parse(body);

                        if (body.code == 1) {
                            data.user = body.user;
                        }

                        callback();
                    }
                });
            }
        };

    async.parallel(https, function (error, result) {

        res.render('portal/list.html', data);
    });
});

//详情页
router.get('/detail', function (req, res) {

    var data = {},

        https = {
            notice: function (callback) {

                request(config.url + '/cms_api/post/postsByCategory', {
                    qs: {
                        siteId: config.site,
                        categoryId: config.categories.jxgg.id,
                        pageSize: 5
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        data.notice = [];
                        body = JSON.parse(body);
                        body.data.forEach(function (e) {

                            data.notice.push({
                                title: e.title,
                                id: e.id
                            });

                        }, this);

                        callback();
                    }
                });
            },
            detail: function (callback) {
                request(config.url + '/cms_api/post/detail', {
                    qs: {
                        siteId: config.site,
                        postId: req.query.id
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        body = JSON.parse(body);

                        data.content = body.post.content;
                        data.authorName = body.post.authorName;
                        data.date = body.post.dateCreated;
                        data.viewCount = body.post.viewCount;
                        data.title = body.post.title;
                        data.id = body.post.id;
                        data.bigTitle = body.post.category.title;

                        callback();
                    }
                });
            },
            userInfo: function (callback) {

                request.post({
                    url: config.url + '/portal_api/user/userInfo',
                    headers: {
                        'Cookie': req.headers.cookie
                    }
                }, function (error, response, body) {

                    data.user = {};

                    if (!error && response.statusCode == 200) {

                        body = JSON.parse(body);

                        if (body.code == 1) {
                            data.user = body.user;
                        }

                        callback();
                    }
                });
            }
        };

    async.parallel(https, function (error, result) {

        res.render('portal/detail.html', data);
    });
});

//院校展示页
router.get('/schools', function (req, res) {

    var data = {},

        https = {
            notice: function (callback) {

                request(config.url + '/cms_api/post/postsByCategory', {
                    qs: {
                        siteId: config.site,
                        categoryId: config.categories.jxgg.id,
                        pageSize: 5
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        data.notice = [];
                        body = JSON.parse(body);
                        body.data.forEach(function (e) {

                            data.notice.push({
                                title: e.title,
                                id: e.id
                            });

                        }, this);

                        callback();
                    }
                });
            },
            schools: function (callback) {
                request(config.url + '/cms_api/post/postsByCategory', {
                    qs: {
                        siteId: config.site,
                        categoryId: config.categories.yxzl.id,
                        page: req.query.page - 1 || 0,
                        pageSize: 6
                    }
                }, function (error, response, body) {

                    if (!error && response.statusCode == 200) {

                        data.schools = [];
                        body = JSON.parse(body);
                        body.data.forEach(function (e) {

                            data.schools.push({
                                title: e.title,
                                image: e.image,
                                id: e.id,
                                text: e.text
                            });

                        }, this);

                        data.totalCount = body.totalCount;
                        data.page = body.page;
                        data.pageSize = 6;
                        callback();
                    }
                });
            },
            userInfo: function (callback) {

                request.post({
                    url: config.url + '/portal_api/user/userInfo',
                    headers: {
                        'Cookie': req.headers.cookie
                    }
                }, function (error, response, body) {

                    data.user = {};

                    if (!error && response.statusCode == 200) {

                        body = JSON.parse(body);

                        if (body.code == 1) {
                            data.user = body.user;
                        }

                        callback();
                    }
                });
            }
        };

    async.parallel(https, function (error, result) {

        res.render('portal/schools.html', data);
    });
});

module.exports = router;