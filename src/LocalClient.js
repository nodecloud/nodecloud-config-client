import YAML from 'yamljs';
import _ from 'lodash';

export default class LocalConfig {
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

        return _.get(this.config, path, defaultValue);
    }
}

function parseYaml(path) {
    return YAML.load(path);
}

function parseJs(path) {
    return require(path);
}

function buildFilePath(path, service, env, ext) {
    return `${path}/${service}-${env}.${ext}`;
}