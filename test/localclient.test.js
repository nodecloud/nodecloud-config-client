import test from 'ava';
import path from 'path';

import LocalClient from '../src/LocalClient';

test('Test local client get js config in development.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'development',
        ext: 'js'
    });

    const config = localClient.getConfig();
    t.is(config.name, 'nodecloud-config-client-development');
});

test('Test local client get js config in production.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'production',
        ext: 'js'
    });

    const config = localClient.getConfig();
    t.is(config.name, 'nodecloud-config-client-production');
});

test('Test local client get js config by key in development.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'development',
        ext: 'js'
    });

    const port = localClient.getConfig('web.port');
    t.is(port, 8080);
});

test('Test local client get js config by key in production.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'production',
        ext: 'js'
    });

    const port = localClient.getConfig('web.port');
    t.is(port, 3000);
});


test('Test local client get yml config in development.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'development',
        ext: 'yml'
    });

    const config = localClient.getConfig();
    t.is(config.name, 'nodecloud-config-client-development');
});

test('Test local client get yml config in production.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'production',
        ext: 'yml'
    });

    const config = localClient.getConfig();
    t.is(config.name, 'nodecloud-config-client-production');
});

test('Test local client get yml config by key in development.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'development',
        ext: 'yml'
    });

    const port = localClient.getConfig('web.port');
    t.is(port, 8080);
});

test('Test local client get yml config by key in production.', async t => {
    const localClient = new LocalClient({
        path: path.resolve(__dirname, './source'),
        service: 'config',
        env: 'production',
        ext: 'yml'
    });

    const port = localClient.getConfig('web.port');
    t.is(port, 3000);
});