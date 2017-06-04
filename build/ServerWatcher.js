'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _HttpClient = require('./HttpClient');

var http = _interopRequireWildcard(_HttpClient);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ServerWatcher {
    /**
     *
     * @param options
     * @param options.url
     * @param options.service
     * @param options.env
     * @param millisecond
     */
    constructor(options, millisecond) {
        this.init(options);
        this.millisecond = millisecond || 60000;
        this.end = false;
    }

    init(options) {
        this.options = {
            url: options.url,
            params: {
                service: options.service,
                env: options.env
            }
        };
    }

    onUpdate(callback) {
        this.callback = callback;
    }

    startWatch() {
        setTimeout(() => {
            http.send(this.options).then(configuration => {
                if (this.callback) this.callback(false, configuration);
            }).catch(err => {
                if (this.callback) this.callback(err, null);
            });

            if (!this.end) {
                this.startWatch();
            }
        }, this.millisecond);
    }

    endWatch() {
        this.end = true;
    }
}
exports.default = ServerWatcher;