const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_first_post_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: req.query.id
        }
    }, function (result) {

        var data = {
            post: {},
            title: '',
            content: ''
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        }

        result.body = JSON.parse(result.body);

        if (result.body.code < 0) {
            deferred.resolve(data);
            return;
        }

        data.id = result.body.post.id;
        data.title = result.body.post.title;
        data.content = result.body.post.content;
        data.category = { title: result.body.post.category.title };

        deferred.resolve(data);
    });

    return deferred.promise;
}