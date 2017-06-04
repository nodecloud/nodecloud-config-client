import Event from 'events';

import {REFRESH_ALL_EVENT, ERROR_EVENT} from './Constants';

export default class Refresher extends Event {
    constructor() {
        super();
    }

    onRefreshAll(callback) {
        if (typeof callback === 'function') {
            this.on(REFRESH_ALL_EVENT, callback);
        }
    }

    onRefresh(key, callback) {
        if (typeof callback === 'function') {
            this.on(key, callback);
        }
    }

    onError(callback) {
        if (typeof callback === 'function') {
            this.on(ERROR_EVENT, callback);
        }
    }

    refreshAll(source) {
        this.emit(REFRESH_ALL_EVENT, source);
    }

    refresh(key, value) {
        this.emit(key, value);
    }

    error(err) {
        this.emit(ERROR_EVENT, err);
    }
}