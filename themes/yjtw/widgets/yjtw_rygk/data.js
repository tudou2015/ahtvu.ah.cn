const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'md2zamgmajzo95u4thm0pa',
            sort: 'sortOrder',
            pageSize: 50
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
        data.category = { href: util.format('category?id=%s', result.body.category.id) };

        result.body.data.forEach(function (e) {

            var props = JSON.parse(e.props);

            data.list.push({
                title: e.title,
                text: e.text,
                summary: e.summary,
                email: props.email || '暂无',
                image: util.format('%s&width=150&height=180', e.image_url)
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}