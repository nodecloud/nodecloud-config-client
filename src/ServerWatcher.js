import * as http from './HttpClient';

export default class ServerWatcher {

    constructor(host, port, service, env, interval, url) {
        this.host = host;
        this.port = port;
        this.env = env;
        this.service = service;
        this.interval = interval || 60000;
        this.url = url;
        this.end = false;
    }

    onUpdate(callback) {
        this.callback = callback;
    }

    startWatch() {
        setTimeout(async () => {
            try {
                const configuration = await http.getRemoteConfig(this.host, this.port, this.service, this.env, this.url);
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