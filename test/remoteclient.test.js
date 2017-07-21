import test from 'ava';

import uriParams from 'uri-params';
import rp from 'request-promise';
import RemoteClient from '../src/RemoteClient';

test('Test remote client get config in development.', async t => {
    const remoteClient = new RemoteClient({
        url: 'http://192.168.0.30:3007/multi-cloud-config-service/v1/config/:service/:env/inner',
        service: 'test-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig();
    t.is(config.name, 'test');
});

test('Test remote client get config by key in development.', async t => {
    const remoteClient = new RemoteClient({
        url: 'http://192.168.0.30:3007/multi-cloud-config-service/v1/config/:service/:env/inner',
        service: 'test-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig('name');
    t.is(config, 'test');
});

test('Test remote client get config by custom client.', async t => {
    const remoteClient = new RemoteClient({
        url: 'http://192.168.0.30:3007/multi-cloud-config-service/v1/config/:service/:env/inner',
        service: 'test-service',
        env: 'development',
        client: {
            send: (request) => {
                //compile uri params.
                if (request.url && request.params) {
                    request.url = uriParams(request.url, request.params);
                }

                //force setting the config.
                request.simple = true;
                request.json = true;
                request.resolveWithFullResponse = false;
                return rp(request);
            }
        },
        interval: 5000
    });

    const config = await remoteClient.getConfig('name');
    t.is(config, 'test');
});