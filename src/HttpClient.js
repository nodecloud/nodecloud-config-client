import util from "lodash";
import rp from "request-promise";
import uriParams from "uri-params";

const URL = '/:service/:env';

/**
 * Send http request.
 *
 * @param options
 * @return {Promise.<*>}
 */
export function send(options = {}) {

    //compile uri params.
    if (options.url && options.params) {
        options.url = uriParams(options.url, options.params);
    }

    //force setting the config.
    options.simple = true;
    options.resolveWithFullResponse = false;

    if (!util.has(options, 'json')) {
        options.json = true;
    }

    return rp(options);
}

export function getRemoteConfig(host, port, service, env, url) {
    const request = {
        url: buildUrl(host, port, url),
        params: {service: service, env: env}
    };

    return send(request);
}

function buildUrl(host, port, url) {
    let fullUrl = 'http://' + host;

    if (port !== 80) {
        fullUrl += ':' + port;
    }

    return fullUrl + url || URL;
}