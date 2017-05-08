const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/search',
        method: 'POST',
        qs: {
            siteId: req.app.site.id,
            search: req.query.search,
            page: req.query.page || 1
        }
    }, function (result) {

        var data = {
            paging: {},
            list: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        data.paging = JSON.stringify(result.body.paging);

        var search = req.query.search;
        result.body.data.forEach(function (e) {

            data.list.push({
                ori_title: e.title,
                title: e.title.replace(new RegExp(search, 'g'), '<b style="color:red;">' + search + '</b>'),
                date: e.date_published,
                text: utils.subString(e.text, 220).replace(new RegExp(search, 'g'), '<b style="color:red;">' + search + '</b>'),
                href: util.format('detail?id=%s', e.id),
            });

        }, this);

        deferred.resolve({ data: data });
    });

    return deferred.promise;
}