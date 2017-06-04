import ConfigClient from '../../src/ConfigClient';

const client = new ConfigClient({
    host: '127.0.0.1',
    port: 8888,
    service: 'service-name',
    env: 'development'
});

client.refresher.on("__refreshAll__", function (value) {
    console.log(value);
});

client.refresher.on("spring.cloud.consul.discovery.hostname", function (value) {
    console.log('spring.cloud.consul.discovery.hostname:' + " " + value);
});