var moment = require('moment');
const util = require('util');

module.exports = function (req, res, utils) {

    var deferred = Promise.defer();

    utils.request({
        url: 'open/get_categories',
        method: 'POST',
        qs: {
            siteId: req.app.site.id
        }
    }, function (result) {
        var data = {
            id: {},
            list: []
        };

        if (result.code != 200) {

            deferred.resolve(data);
            return;
        };

        result.body = JSON.parse(result.body);

        result.body.data.forEach(function (e) {

            if (!e.show_in_menu) return;

              var tmp = {
                id: e.id,
                title: e.title,
                url: e.url,
                href: e.children.length > 0 ? 'javascript:void(0);' : util.format('category?id=%s', e.id),
                children: []
            };

            e.children.forEach(function (r) {

                if (!r.show_in_menu) return;

                tmp.children.push({
                    id: r.id,
                    title: r.title,
                    url: r.url,
                    href: util.format('category?id=%s', r.id)
                });
            });

            data.list.push(tmp);
        }, this);

        deferred.resolve({
            data: data,
            time: {
                ticks: moment()._d.getTime(),
                value: moment().format('YYYY年MM月DD日 HH:mm:ss')
            }
        });
    });

    return deferred.promise;
}