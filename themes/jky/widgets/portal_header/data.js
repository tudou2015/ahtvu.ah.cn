var moment = require('moment');

module.exports = function () {

    var deferred = Promise.defer();

    deferred.resolve({
        time: {
            ticks: moment()._d.getTime(),
            value: moment().format('YYYY年MM月DD日 HH:mm:ss')
        }
    });

    return deferred.promise;
}