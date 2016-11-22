const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_post_info',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            postId: req.query.id
        }
    }, function (result) {

        var data = {
            category: {},
            title: '',
            content: '',
            id:''
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

        data.category = result.body.post.category;
        data.title = result.body.post.title;
        data.content = result.body.post.content;
        data.id = result.body.post.id;

        deferred.resolve(data);
    });

    return deferred.promise;
}