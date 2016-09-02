const util = require('util');

var config = {
    host: 'www.ahtvu1.ah.cn',          // 外网真实地址
    port: 3000,                    // 外网真实地址的端口
    _origin: '',
    origin: function () {

        if (this._origin) return this._origin;

        this._origin = util.format('http://%s', this.host);

        if (this.port && this.port != 80) this._origin = util.format("%s:%d", this._origin, this.port);

        return this._origin;
    },
    cms: {
        host: '192.168.1.230',                // 内网 cms 接口地址
        port: 80,                           // 内网 cms 接口地址的端口
        site: "8-dnag6m9znkhvyqnm-q-w",     // 站点ID
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