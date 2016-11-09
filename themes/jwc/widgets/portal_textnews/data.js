const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_posts_by_category',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            categoryId: 'qry0ak2mxq5jcas-sj4r7g',
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
        data.category = { href: util.format('/category?id=%s', result.body.category.id) };

        result.body.data.forEach(function (e) {

            //设置第一个显示的新闻                    
            if (!data.first) {

                e.text ? e.text : (e.text = e.title);
                e.image_url ? (e.image_url = util.format('%s&width=171&height=105', e.image_url)) : '';

                data.first = {
                    image: e.image_url,
                    title: utils.subString(e.title, 25),
                    text: (e.image_url ? utils.subString(e.text, 27) : utils.subString(e.text, 50)),
                    href: utils.urlFormat(util.format('/detail?id=%s', e.id))
                };

                return false;
            }

            data.list.push({
                ori_title: e.title,
                title: utils.subString(e.title, 25),
                date: e.date_published,
                href: utils.urlFormat(util.format('/detail?id=%s', e.id))
            });
 
        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}