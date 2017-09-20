var moment = require('moment'),
    config = require('../config.js'),
    request = require('request');

var logger = require('tracer').console({
    transport: function (data) {
        fs.appendFile('./file.log', data.output + '\n', (err) => {
            if (err) throw err;
        });
    }
});

const util = require('util');

module.exports = {

    /**
     * format date
     * @param date 要格式化的日期；unix_time，string；
     * @param format 要进行格式化的模式字符串；默认值：YYYY-MM-DD HH:mm:ss；
     * @return string
     * @author leonard
     */
    dateFormat: function (date, format) {

        //unix time        
        if (typeof date == 'number') date = date * 1000;

        try {

            date = moment(date);

            //default date format
            if (!format) return date.format('YYYY-MM-DD HH:mm:ss');

            return date.format(format);

        } catch (error) {

            console.error('format date error: %s \r\n', error.stack);

            return 'error date';
        }
    },

    /**
     * 截取指定长度的字符串
     * @param text 要截取的字符串
     * @param length 要保留的长度
     * @return string
     * @author leonard
     */
    subString: function (text, length) {

        if (typeof text != 'string') text = text.toString();

        if (text.length <= length) return text;

        return util.format('%s...', text.substring(0, length));
    },

    /**
     * make a request with params
     * @config 请求的参数配置，包含 url,method,qs,headers
     * @callback 请求结束后的回调函数
     * @author leonard
     */
    request: function (params, callback, deferred) {

        if (!params) {

            console.error('request config is not defined \r\n');
            return;
        }

        request({
            uri: params.url,
            baseUrl: params.baseUrl || util.format('%s/', config.cms.origin()),
            method: params.method || 'GET',
            headers: params.headers || {},
            qs: params.qs || {},
            useQuerystring: true
        }, function (error, response, body) {

            if (!!error) {

                console.error('request but an error was occurred: %s', error.stack);
                /*
                                callback && callback.apply(this, [{
                                    code: response.statusCode || -1,
                                    response: response,
                                    body: body
                                }]);
                                */

                if (deferred) {
                    deferred.reject(error);
                }

                return;
            }

            try {
                callback && callback.apply(this, [{
                    code: response.statusCode,
                    response: response,
                    body: body
                }]);
            } catch (e) {
                if (deferred) {
                    deferred.reject(e)
                } else {
                    console.log(e);
                }
            }
        });
    }
};