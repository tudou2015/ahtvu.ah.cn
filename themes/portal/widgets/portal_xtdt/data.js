const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.site.id,
            categoryId: req.query.id,
            withChildren: false,
            page: req.query.page || 1
        }
    }, function (result) {

        var data = {
            category: {},
            paging: {},
            list: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        data.category = result.body.category;
        data.paging = JSON.stringify(result.body.paging);

        result.body.data.forEach(function (e) {

            data.list.push({
                title: e.title,
                date: e.date_published,
                href: util.format('xtdtdetail?id=%s', e.id)
            });

        }, this);

        deferred.resolve({ data: data });
    },deferred);

    return deferred.promise;
}