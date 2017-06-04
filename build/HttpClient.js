"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.send = send;

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require("request-promise");

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _uriParams = require("uri-params");

var _uriParams2 = _interopRequireDefault(_uriParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Send http request.
 *
 * @param options
 * @return {Promise.<*>}
 */
function send(options = {}) {

    //compile uri params.
    if (options.url && options.params) {
        options.url = (0, _uriParams2.default)(options.url, options.params);
    }

    //force setting the config.
    options.simple = true;
    options.resolveWithFullResponse = false;

    if (!_lodash2.default.has(options, 'json')) {
        options.json = true;
    }

    return (0, _requestPromise2.default)(options);
}