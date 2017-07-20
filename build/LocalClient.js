'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _yamljs = require('yamljs');

var _yamljs2 = _interopRequireDefault(_yamljs);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocalConfig {
    constructor(options) {
        this.config = {};

        const filePath = buildFilePath(options.path, options.service, options.env, options.ext);
        if (options.ext === 'yml') {
            this.config = parseYaml(filePath);
        } else {
            this.config = parseJs(filePath);
        }
    }

    getConfig(path, defaultValue) {
        if (!path) {
            return this.config;
        }

        return _lodash2.default.get(this.config, path, defaultValue);
    }
}

exports.default = LocalConfig;
function parseYaml(path) {
    return _yamljs2.default.load(path);
}

function parseJs(path) {
    return require(path);
}

function buildFilePath(path, service, env, ext) {
    return `${path}/${service}-${env}.${ext}`;
}