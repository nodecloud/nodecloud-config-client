# node-cloud-config-client

This is a client for spring-cloud-config-server written by node.

## Usage
```
npm install node-cloud-config-client --save
```

```javascript
import Client from 'node-cloud-config-client';

const client = new Client({
    host: '127.0.0.1',
    port: 8888,
    service: 'service',
    env: 'development',
    interval: 60000
});

client.refresher.onRefreshAll(value => {
    console.log(value);
});

client.refresher.onRefresh("datasource.username", value => {
    console.log('datasource.username: ' + value);
});

client.refresher.onError(err => {
    console.log(err);
})
```

## API

### new ConfigClient(options)

* @param options
* @param options.host The host of spring-cloud-config-server.
* @param options.port The port of spring-cloud-config-server.
* @param options.service The name of the service.
* @param options.env The environment of application(eg: development, production).
* @param options.interval How long to refresh the configuration, default is one minute.(millisecond)

### client.onRefreshAll(callback)

* @param callback
* @param callback(propertySources)

The propertySources is such as:
> { 
>   'spring.cloud.consul.discovery.hostname': 'localhost',
>   'spring.cloud.consul.host': 'localhost',
>   'spring.cloud.consul.config.format': 'yaml'
> }

### client.onRefresh(key, callback)

* @param key The configuration key
* @param callback
* @param callback(value)

### client.onError(err)

* @param err 