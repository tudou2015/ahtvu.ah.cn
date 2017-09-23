const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.site.id,
            categoryId: '9at-apemzjliojbzj6fp-a'
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
        data.category = { title: result.body.category.title };

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

                image = util.format('%s&width=%d&height=%d', image, 272, 430);
            }

            //设置第一个显示的新闻                    
            if (!data.first) {

                e.text ? e.text : (e.text = e.title);
                var props = JSON.parse(e.props);

                data.first = {
                    image: image,
                    title: utils.subString(e.title, 25),
                    text: (e.image_url ? utils.subString(e.text, 27) : utils.subString(e.text, 50)),
                    tel: props.tel || '暂无',
                    summary: e.summary,
                    href: util.format('detail?id=%s', e.id)
                };

                return false;
            }
 
        }, this);

        deferred.resolve({ data: data });
    },deferred);

    return deferred.promise;
}