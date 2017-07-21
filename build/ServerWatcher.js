'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _HttpClient = require('./HttpClient');

var http = _interopRequireWildcard(_HttpClient);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ServerWatcher {

    constructor(service, env, interval, url, client) {
        this.env = env;
        this.service = service;
        this.interval = interval || 60000;
        this.url = url;
        this.client = client;
        this.end = false;
        this.timerId = null;
    }

    onUpdate(callback) {
        this.callback = callback;
    }

    startWatch() {
        var _this = this;

        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.timerId = setTimeout(_asyncToGenerator(function* () {
            try {
                const configuration = yield http.getRemoteConfig(_this.service, _this.env, _this.url, _this.client);
                _this.callback && _this.callback(false, configuration);
            } catch (e) {
                _this.callback && _this.callback(e, null);
            }

            if (!_this.end) {
                try {
                    _this.startWatch();
                } catch (ignore) {}
            }
        }), this.interval);
    }

    endWatch() {
        this.end = true;
    }
}
exports.default = ServerWatcher;