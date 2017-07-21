import test from 'ava';

import RemoteClient from '../src/RemoteClient';

test('Test remote client get config in development.', async t => {
    const remoteClient = new RemoteClient({
        host: '192.168.0.30',
        port: 3007,
        url: '/multi-cloud-config-service/v1/config/:service/:env/inner',
        service: 'test-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig();
    t.is(config.name, 'test');
});

test('Test remote client get config by key in development.', async t => {
    const remoteClient = new RemoteClient({
        host: '192.168.0.30',
        port: 3007,
        url: '/multi-cloud-config-service/v1/config/:service/:env/inner',
        service: 'test-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig('name');
    t.is(config, 'test');
});