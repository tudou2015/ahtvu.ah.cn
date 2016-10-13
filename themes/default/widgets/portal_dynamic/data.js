const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'nds6aj6mprbbxi66w6wjwg',
            pageSize: 5
        }
    }, function (result) {

        var data = {
            category: {},
            list: [],
            first: undefined
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        data.category = { href: util.format('/portal/category?id=%s', result.body.category.id) };
        result.body.data.forEach(function (e) {

            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                href: utils.urlFormat(util.format('/portal/newspost?id=%s', e.id))
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}