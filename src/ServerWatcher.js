import scheduler from 'node-schedule';
import * as http from './HttpClient';

export default class ServerWatcher {
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
        this.millisecond = millisecond || 5000;
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