import * as http from './HttpClient';

export default class ServerWatcher {

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
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
        this.timerId = setTimeout(async () => {
            try {
                const configuration = await http.getRemoteConfig(this.service, this.env, this.url, this.client);
                this.callback && this.callback(false, configuration);
            } catch (e) {
                this.callback && this.callback(e, null);
            }

            if (!this.end) {
                try {
                    this.startWatch();
                } catch (ignore) {
                }
            }
        }, this.interval);
    }

    endWatch() {
        this.end = true;
    }
}