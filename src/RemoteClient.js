import _ from 'lodash';
import * as httpClient from './HttpClient';
import ServerWatcher from './ServerWatcher';

export default class RemoteConfig {
    constructor(options) {
        this.client = options.client;
        this.url = options.url;

        this.env = options.env;
        this.service = options.service;

        this.lastVersion = '';
        this.lastConfiguration = null;

        this.watcher = new ServerWatcher(this.service, this.env, options.interval, this.url, this.client);

        this.watcher.onUpdate((err, configuration) => {
            if (err) {
                this.errorCallback && this.errorCallback(err);
            }

            this.handleConfiguration(configuration);
        });

        this.refreshCallback = null;
        this.refreshAllCallback = null;
        this.errorCallback = null;
    }

    onRefresh(callback) {
        this.refreshCallback = callback;
    }

    onRefreshAll(callback) {
        this.refreshAllCallback = callback;
    }

    onError(callback) {
        this.errorCallback = callback;
    }

    end() {
        this.watcher.endWatch();
    }

    async loadConfig() {
        try {
            const configuration = await httpClient.getRemoteConfig(this.service, this.env, this.url, this.client);

            this.handleConfiguration(configuration);
            this.watcher.startWatch();
        } catch (e) {
            this.watcher.endWatch();
            throw e;
        }
    }

    async getConfig(path, defaultValue) {
        if (!this.lastConfiguration) {
            await this.loadConfig();
        }

        const config = transformToObject(this.lastConfiguration || {});

        if (!path) {
            return config;
        }

        return _.get(config, path, defaultValue);
    }

    handleConfiguration(configuration) {
        if (this.lastVersion !== configuration.version) {
            this.lastVersion = configuration.version;
            const finalConfiguration = this.getFinalConfigurationSource(configuration);
            this.compareAndSet(finalConfiguration);
        }
    }

    /**
     *
     * @param configuration
     * @param configuration.propertySources
     * @param configuration.finalSource
     * @return {*}
     */
    getFinalConfigurationSource(configuration) {
        if (typeof configuration === 'string') {
            throw new Error(`Please add header Content-Type:application/json to your http client.`);
        }

        const sources = configuration.propertySources;
        if (sources.length > 0 && !this.lastConfiguration) {
            this.lastConfiguration = {};
        }

        let globalSource = null, envSource = null, source = null;
        const finalSource = {};

        sources.forEach(item => {
            if (item.name && ~item.name.indexOf("application")) {
                globalSource = item.source;
            } else if (item.name && ~item.name.indexOf(this.service + '-' + this.env)) {
                envSource = item.source;
            } else if (item.name && ~item.name.indexOf(this.service)) {
                source = item.source;
            }
        });

        [globalSource, source, envSource]
            .filter(source => source)
            .forEach(source => Object.assign(finalSource, source));
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

                this.refreshCallback && this.refreshCallback(key, this.lastConfiguration[key]);
            }
        }

        if (this.lastConfiguration) {
            this.refreshAllCallback && this.refreshAllCallback(this.lastConfiguration);
        }
    }
}

function transformToObject(configuration) {
    const config = {};
    for (const key in configuration) {
        if (!configuration.hasOwnProperty(key)) {
            continue;
        }

        _.set(config, key, configuration[key]);
    }

    return config;
}