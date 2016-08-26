var moment = require('moment'),
    config = require('../config.js'),
    request = require('request');

//request = request.defaults({ proxy: 'http://127.0.0.1:8888' });

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
     * format url
     * @param path url 路径； eg. post/detail?siteId=xxxxx => http://host:port/post/detail?siteId=xxxxx
     * @return string
     * @author leonard
     */
    urlFormat: function (path) {

        if (!config.host) return util.format('%s%s', (path.indexOf('/') != 0 ? '/' : ''), path);

        if (path.indexOf('/') != 0) path = util.format('/%s', path);

        return util.format('%s%s', config.origin(), path);
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
    request: function (params, callback) {

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

                callback && callback.apply(this, [{ code: response.statusCode || -1, response: response, body: body }]);
                return;
            }

            callback && callback.apply(this, [{ code: response.statusCode, response: response, body: body }]);
        });
    }
};