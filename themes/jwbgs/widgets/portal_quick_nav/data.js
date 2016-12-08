const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_same_level_categories',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: '3ugradamibvmehdn7ntm5w'
        }
    }, function (result) {
        var data = {
            id: {},
            list: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        result.body.categories.forEach(function (e) {

            data.list.push({
                id: e.id,
                title: e.title,
                url: e.url,
                href: util.format('category?id=%s', e.id)
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}