const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'sgmraecn26pa9cfzz0itwg',
            pageSize: 6
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
        data.category = { href: util.format('category?id=%s', result.body.category.id) };

        result.body.data.forEach(function (e) {

            data.list.push({
                title: e.title,
                date: e.date_published,
                href: util.format('detail?id=%s', e.id)
            });
 
        }, this);

        deferred.resolve({ data: data });
    },deferred);

    return deferred.promise;
}