const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'tmkaaogmo7rntad6dh0ofq',
            pageSize: 3
        }
    }, function (result) {

        var data = {
            category: {},
            list: [],
            imgNew:[]
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
                image: e.image_url,
                href: util.format('detail?id=%s', e.id)
            });

            var imageAll = e.image_url;
            if (imageAll) {
                data.imgNew.push({
                    title: e.title,
                    image: e.image_url,
                    href: util.format('detail?id=%s', e.id)
                });
            }
        }, this);

        deferred.resolve({ data: data });
    },deferred);

    return deferred.promise;
}