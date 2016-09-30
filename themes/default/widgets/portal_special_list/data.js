const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'jvcdaiemvatf1if6usvhjq',
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

            var props = JSON.parse(e.props);

            data.list.push({
                title: e.title,
                image: e.image_url,
                href: props.href || 'javascript:void(0);',
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}