const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'qry0ak2mxq5jcas-sj4r7g',
            pageSize: ''
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
                href: utils.urlFormat(util.format('detail?id=%s', e.id))
            });

            var imageAll = e.image_url;
            if (imageAll) {
                data.imgNew.push({
                    title: e.title,
                    image: e.image_url,
                    href: utils.urlFormat(util.format('detail?id=%s', e.id))
                });
            }
        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}