const util = require('util');

var config = {
    cms: {
        host: '192.168.1.245', // 内网 cms 接口地址
        port: 5657, // 内网 cms 接口地址的端口
        _origin: '',
        origin: function () {

            if (this._origin) return this._origin;

            this._origin = util.format('http://%s', this.host);

            if (this.port && this.port != 80) this._origin = util.format("%s:%d", this._origin, this.port);

            return this._origin;
        }
    }
};

module.exports = config;