var express = require('express'),
    router = express.Router(); //引入exopress的路由方法

const util = require('util');

//wfxy
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

module.exports = router;