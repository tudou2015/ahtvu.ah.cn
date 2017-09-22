const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'eiysan-nsk9ectnpfppnzw',
            withChildren: true,
            sort: 'sortOrder',
            pageSize: 6
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

        result.body.data.forEach(function (e) {

            var props = JSON.parse(e.props);

            data.list.push({
                title: e.title,
                date: e.date_published,
                href: props.href || 'javascript:void(0);',
            });

        }, this);

        deferred.resolve({
            data: data
        });
    },deferred);

    return deferred.promise;
}