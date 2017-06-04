'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _Constants = require('./Constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Refresher extends _events2.default {
    constructor() {
        super();
    }

    onRefreshAll(callback) {
        if (typeof callback === 'function') {
            this.on(_Constants.REFRESH_ALL_EVENT, callback);
        }
    }

    onRefresh(key, callback) {
        if (typeof callback === 'function') {
            this.on(key, callback);
        }
    }

    onError(callback) {
        if (typeof callback === 'function') {
            this.on(_Constants.ERROR_EVENT, callback);
        }
    }

    refreshAll(source) {
        this.emit(_Constants.REFRESH_ALL_EVENT, source);
    }

    refresh(key, value) {
        this.emit(key, value);
    }

    error(err) {
        this.emit(_Constants.ERROR_EVENT, err);
    }
}
exports.default = Refresher;