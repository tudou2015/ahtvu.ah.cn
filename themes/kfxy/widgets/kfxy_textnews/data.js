const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'pt2qaecnfqrl6w65hz0xha',
            pageSize: 6
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

            var image = e.image_url;

            if (image) {

                if (image.indexOf('&width') != -1 && image.indexOf('&height') != -1) {

                    image = image.substring(0, image.indexOf('&width'));
                } else if (image.indexOf('&width') != -1 && image.indexOf('&height') == -1) {

                    image = image.substring(0, image.indexOf('&width'));
                } else if (image.indexOf('&height') != -1 && image.indexOf('&width') == -1) {

                    image = image.substring(0, image.indexOf('&height'));
                }

                image = util.format('%s&width=%d&height=%d', image, 120, 75);
            }
                    
            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                href: util.format('detail?id=%s', e.id)
            });
 
        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}