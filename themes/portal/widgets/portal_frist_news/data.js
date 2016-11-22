const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: '6g3pag6mr79pjuqwzlkaxw',
            withChildren: true,
            pageSize: 1
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

            //设置第一个显示的新闻                    
            if (!data.first) {

                e.text ? e.text : (e.text = e.title);
                e.image_url ? (e.image_url = util.format('%s&width=147&height=90', e.image_url)) : '';

                data.first = {
                    image: e.image_url,
                    title: utils.subString(e.title, 25),
                    text: (e.image_url ? utils.subString(e.text, 80) : utils.subString(e.text, 86)),
                    href: util.format('detail?id=%s', e.id)
                };

                return false;
            }

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}