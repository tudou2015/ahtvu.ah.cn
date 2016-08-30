const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: req.query.id
        }
    }, function (result) {

        var data = {
            category: {},
            list: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        data.category = result.body.category;
        result.body.data.forEach(function (e) {

            data.list.push({
                title: e.title,
                href: utils.urlFormat(util.format('/detail?id=%s', e.id)),
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}