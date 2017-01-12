const util = require('util');
module.exports = function (req, res, utils) {
    var deferred = Promise.defer();
    utils.request({
        url: 'open/get_first_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            parentId: 'q9b9apemm7terljaxfvrng'
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

        data.category = {
            id: result.body.data.id,
            href: util.format('category?id=%s', result.body.data.id),
            title: result.body.data.title
        };

        utils.request({
            url: 'open/get_posts_by_category',
            method: 'POST',
            qs: {
                siteId: req.app.site.id,
                categoryId: data.category.id,
                pageSize: 100
            }
        }, function (result) {

            if (result.code != 200) {

                deferred.resolve(data);
                return;
            };

            result.body = JSON.parse(result.body);

            result.body.data.forEach(function (e) {

                var props = JSON.parse(e.props);

                data.list.push({
                    ori_title: e.title,
                    title: utils.subString(e.title, 25),
                    date: e.date_published,
                    author: props.author || '暂无',
                    image: e.image_url,
                    href: util.format('detail?id=%s', e.id)
                });

            }, this);

            deferred.resolve({
                data: data
            });
        });
    });
    return deferred.promise;
}