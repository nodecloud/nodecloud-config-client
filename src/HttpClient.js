import util from "lodash";
import rp from "request-promise";
import uriParams from "uri-params";

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

export function getRemoteConfig(service, env, url, client) {
    if (client) {
        return client.send({
            url: url,
            params: {service: service, env: env}
        });
    }

    return send({
        url: url,
        params: {service: service, env: env}
    });
}