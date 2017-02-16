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

        var data = [];
        if (result.code != 200) {

            deferred.resolve(data);
            return;
        }

        deferred.resolve(JSON.parse(result.body));
    });

    return deferred.promise;
}