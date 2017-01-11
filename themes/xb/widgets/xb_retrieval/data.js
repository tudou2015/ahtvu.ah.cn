const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'arcpafemnyxjt6eumdrojw'
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
            href: util.format('category?id=%s', result.body.category.id),
            title: result.body.category.title
        };

        result.body.data.forEach(function (e) {

            var props = JSON.parse(e.props);

            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                author:props.author || '暂无',
                image: e.image_url,
                href: util.format('detail?id=%s', e.id)
            });

        }, this);

        deferred.resolve({
            data: data
        });
    });

    return deferred.promise;
}