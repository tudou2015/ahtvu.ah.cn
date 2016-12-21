const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'vy30aoomrrpk2ror-s30cq',
            pageSize: 5
        }
    }, function (result) {

        var data = {
            category: {},
            list: [],
            first: undefined,
            imgNew: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);
        data.category = {
            href: util.format('category?id=%s', result.body.category.id),
            title: result.body.category.title
        };

        result.body.data.forEach(function (e) {

            //设置第一个显示的新闻                    
            if (!data.first) {

                e.text ? e.text : (e.text = e.title);
                e.image_url ? (e.image_url = util.format('%s&width=171&height=105', e.image_url)) : '';

                data.first = {
                    image: e.image_url,
                    title: utils.subString(e.title, 13),
                    text: (e.image_url ? utils.subString(e.text, 27) : utils.subString(e.text, 50)),
                    href: util.format('detail?id=%s', e.id)
                };

                return false;
            }

            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                image: e.image_url,
                href: util.format('detail?id=%s', e.id)
            });

            var imageAll = e.image_url;
            if (imageAll) {
                data.imgNew.push({
                    title: e.title,
                    image: e.image_url,
                    href: util.format('detail?id=%s', e.id)
                });
            }

        }, this);

        deferred.resolve({
            data: data
        });
    });

    return deferred.promise;
}