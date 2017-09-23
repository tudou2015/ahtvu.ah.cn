const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_post_info',
        method: 'POST',
        qs: {
            siteId: req.site.id,
            postId: 't4y3acmnto9i-0b6g6sp6w'
        }
    }, function (result) {

        var data = [];
        if (result.code != 200) {

            deferred.resolve(data);
            return;
        }

        deferred.resolve(JSON.parse(result.body));
    },deferred);

    return deferred.promise;
}