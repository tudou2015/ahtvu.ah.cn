const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.site.id,
            categoryId: 'rcp-apemgjdbt3peomdicw',
            pageSize: 5
        }
    }, function (result) {

        var data = {
            category: {},
            list: [],
            first: undefined,
            imgNew: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);
        data.category = {
            href: util.format('category?id=%s', result.body.category.id),
            title: result.body.category.title
        };

        result.body.data.forEach(function (e) { 

            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                image: e.image_url,
                href: util.format('detail?id=%s', e.id)
            });

        }, this);

        deferred.resolve({
            data: data
        });
    },deferred);

    return deferred.promise;
}