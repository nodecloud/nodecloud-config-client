import Event from 'events';
import RemoteClient from './RemoteClient';
import LocalClient from './LocalClient';

export const ERROR_EVENT = 'error_event';
export const CONFIG_REFRESH_EVENT = 'config_refresh_event';

export default class ConfigClient extends Event {
    /**
     *
     * @param options
     * @param options.remote.host
     * @param options.remote.port
     * @param options.remote.service
     * @param options.remote.interval
     * @param options.remote.url
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
        }

        if (options.local) {
            this.local = initialLocalConfig(options.local);
        }

        this.remoteClient = new RemoteClient(this.remote);
        this.remoteClient.onRefresh((key, config) => this.emit(key, config));
        this.remoteClient.onRefreshAll(config => this.emit(CONFIG_REFRESH_EVENT, config));
        this.remoteClient.onError(err => this.emit(ERROR_EVENT, err));
        this.localClient = new LocalClient(this.local);
    }

    async getConfig(path, defaultValue) {
        if (this.configType === 'remote') {
            try {
                return {
                    type: this.configType,
                    config: await this.remoteClient.getConfig(path, defaultValue)
                }
            } catch (e) {
                this.emit(ERROR_EVENT, e);
                this.configType = 'local';
            }
        }

        return {
            type: this.configType,
            config: this.localClient.getConfig(path, defaultValue)
        }
    }

    destroy() {
        this.remoteClient.end();
    }
}

function initialRemoteConfig(remote) {
    if (!remote.host) {
        throw new Error('The host param is required.');
    }

    if (!remote.service) {
        throw new Error('The service param is required.');
    }

    if (!remote.interval) {
        remote.interval = 60000;
    }

    remote.env = process.env.NODE_ENV;
    return remote;
}

function initialLocalConfig(local) {
    if (!local.path) {
        throw new Error('The path param is required.');
    }

    if (!local.type) {
        local.type = 'js';
    }

    local.env = process.env.NODE_ENV;
    return local;
}

