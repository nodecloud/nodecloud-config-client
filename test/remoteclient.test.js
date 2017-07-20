import test from 'ava';

import RemoteClient from '../src/RemoteClient';

test('Test remote client get config in development.', async t => {
    const remoteClient = new RemoteClient({
        host: 'localhost',
        port: 8888,
        service: 'i5sing-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig();
    t.is(config.spring.cloud.consul.host, 'consul.miaow.io');
});

test('Test remote client get config by key in development.', async t => {
    const remoteClient = new RemoteClient({
        host: 'localhost',
        port: 8888,
        service: 'i5sing-service',
        env: 'development',
        interval: 5000
    });

    const config = await remoteClient.getConfig('spring.cloud.consul.host');
    t.is(config, 'consul.miaow.io');
});