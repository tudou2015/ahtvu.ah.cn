const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: '4dzyadkn1knizlixyruvkq',
            withChildren: false,
            sort: 'sortOrder'
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

        data.category.title = result.body.category.title;

        result.body.data.forEach(function (e) {

            var props = JSON.parse(e.props);

            data.list.push({
                title: e.title,
                href: props.href || 'javascript:void(0);',
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}