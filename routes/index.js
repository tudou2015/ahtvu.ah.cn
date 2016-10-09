var express = require('express'),
    router = express.Router(),
    config = require('../config.js'),
    utils = require('../utils/utils'),
    async = require('async'),
    moment = require('moment');

const util = require('util');

//首页
router.get('/', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'index.html';

    next();
});

//list
router.get('/category', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'list.html';

    next();
});

//detail
router.get('/detail', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'post.html';

    next();
});

//info
router.get('/info', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'info.html';

    next();
});

//学生空间
router.get('/student', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'student.html';

    next();
});

//教师空间
router.get('/teacher', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'teacher.html';

    next();
});

//学校概况
router.get('/xxgk', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xxgk.html';

    next();
});

//系统概况
router.get('/xtgk', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xtgk.html';

    next();
});

//系统文件
router.get('/xtwj', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xtwj.html';

    next();
});

//系统文件详情
router.get('/xtwjdetail', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xtwjpost.html';

    next();
});

//系统动态
router.get('/xtdt', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xtdt.html';

    next();
});

//系统动态详情
router.get('/xtdtdetail', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xtdtpost.html';

    next();
});

//学校领导
router.get('/xxld', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'xxld.html';

    next();
});

//专题列表
router.get('/subject', function (req, res, next) {

    //set render html with widget
    res.context = {};

    res.context._r_widget = true
    res.context._r_widget_skin = 'subject.html';

    next();
});

module.exports = router;