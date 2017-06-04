'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Refresher = require('./Refresher');

var _Refresher2 = _interopRequireDefault(_Refresher);

var _ServerWatcher = require('./ServerWatcher');

var _ServerWatcher2 = _interopRequireDefault(_ServerWatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const URL = '/:service/:env';

class ConfigClient {
    /**
     *
     * @param options
     * @param options.host
     * @param options.port
     * @param options.service
     * @param options.env
     * @param options.interval
     */
    constructor(options) {
        if (!options.host || !options.service || !options.env) {
            throw new Error('Please check your options, maybe the host, port, service or port is empty.');
        }
        this.service = options.service;
        this.env = options.env;
        this.refresher = new _Refresher2.default();
        this.watcher = new _ServerWatcher2.default({
            url: this.buildUrl(options.host, options.port),
            service: options.service,
            env: options.env
        }, options.interval);

        this.lastVersion = '';
        this.lastConfiguration = null;

        this.handleConfiguration();
        this.watcher.startWatch();
    }

    handleConfiguration() {
        this.watcher.onUpdate((err, configuration) => {
            if (err) {
                return this.refresher.error(err);
            }

            if (this.lastVersion !== configuration.version) {
                this.lastVersion = configuration.version;
                const finalConfiguration = this.getFinalConfigurationSource(configuration);
                this.compareAndSet(finalConfiguration);
            }
        });
    }

    getFinalConfigurationSource(configuration) {
        const sources = configuration.propertySources;
        if (sources.length > 0 && !this.lastConfiguration) {
            this.lastConfiguration = {};
        }

        let globalSource = null,
            envSource = null,
            source = null;
        const finalSource = {};

        sources.forEach(item => {
            if (item.name && ~item.name.indexOf("application.yml")) {
                globalSource = item.source;
            } else if (item.name && ~item.name.indexOf(this.service + '-' + this.env + '.yml')) {
                envSource = item.source;
            } else if (item.name && ~item.name.indexOf(this.service + '.yml')) {
                source = item.source;
            }
        });

        [globalSource, source, envSource].filter(source => source).forEach(source => Object.assign(finalSource, source));
        configuration.finalSource = finalSource;

        return configuration;
    }

    compareAndSet(configuration) {
        if (!configuration.finalSource) {
            return;
        }

        for (const key in configuration.finalSource) {
            if (!configuration.finalSource.hasOwnProperty(key)) {
                continue;
            }

            if (this.lastConfiguration[key] !== configuration.finalSource[key]) {
                this.lastConfiguration[key] = configuration.finalSource[key];

                this.refresher.refresh(key, this.lastConfiguration[key]);
            }
        }

        if (this.lastConfiguration) {
            this.refresher.refreshAll(this.lastConfiguration);
        }
    }

    buildUrl(host, port) {
        let fullUrl = 'http://' + host;

        if (port !== 80) {
            fullUrl += ':' + port;
        }

        return fullUrl + URL;
    }
}
exports.default = ConfigClient;