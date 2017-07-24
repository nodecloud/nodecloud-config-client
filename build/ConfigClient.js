'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CONFIG_REFRESH_EVENT = exports.ERROR_EVENT = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _RemoteClient = require('./RemoteClient');

var _RemoteClient2 = _interopRequireDefault(_RemoteClient);

var _LocalClient = require('./LocalClient');

var _LocalClient2 = _interopRequireDefault(_LocalClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ERROR_EVENT = exports.ERROR_EVENT = 'error_event';
const CONFIG_REFRESH_EVENT = exports.CONFIG_REFRESH_EVENT = 'config_refresh_event';

class ConfigClient extends _events2.default {
    /**
     *
     * @param options
     * @param options.remote.service
     * @param options.remote.interval
     * @param options.remote.url
     * @param options.remote.client
     * @param options.local.path
     * @param options.local.service
     * @param options.local.ext
     */
    constructor(options) {
        super();

        if (!options.remote && !options.local) {
            throw new Error('No configuration was found, please check your options.');
        }

        this.remote = {};
        this.local = {};
        this.configType = 'remote';

        if (!options.remote) {
            this.configType = 'local';
        }

        if (options.remote) {
            this.remote = initialRemoteConfig(options.remote);
            this.remoteClient = new _RemoteClient2.default(this.remote);
            this.remoteClient.onRefresh((key, config) => this.emit(key, config));
            this.remoteClient.onRefreshAll(config => this.emit(CONFIG_REFRESH_EVENT, config));
            this.remoteClient.onError(err => this.emit(ERROR_EVENT, err));
        }

        if (options.local) {
            this.local = initialLocalConfig(options.local);
            this.localClient = new _LocalClient2.default(this.local);
        }
    }

    getConfig(path, defaultValue) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (_this.configType === 'remote') {
                try {
                    return {
                        type: _this.configType,
                        config: yield _this.remoteClient.getConfig(path, defaultValue)
                    };
                } catch (e) {
                    _this.emit(ERROR_EVENT, e);
                    _this.configType = 'local';
                }
            }

            return {
                type: _this.configType,
                config: _this.localClient.getConfig(path, defaultValue)
            };
        })();
    }

    destroy() {
        this.remoteClient.end();
    }
}

exports.default = ConfigClient;
function initialRemoteConfig(remote) {
    if (!remote.service) {
        throw new Error('The service param is required.');
    }

    if (!remote.interval) {
        remote.interval = 60000;
    }

    remote.env = process.env.NODE_ENV || 'development';
    return remote;
}

function initialLocalConfig(local) {
    if (!local.path) {
        throw new Error('The path param is required.');
    }

    if (!local.type) {
        local.type = 'js';
    }

    local.env = process.env.NODE_ENV || 'development';
    return local;
}