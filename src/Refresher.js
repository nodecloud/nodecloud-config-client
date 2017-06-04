import Event from 'events';

import {REFRESH_ALL_EVENT, ERROR_EVENT} from './Constants';

export default class Refresher extends Event {
    constructor() {
        super();
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