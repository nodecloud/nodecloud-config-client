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

client.refresher.on(Client.REFRESH_ALL_EVENT, value => {
    console.log(value);
});

client.refresher.on("datasource.username", value => {
    console.log('datasource.username: ' + value);
});

client.refresher.on(Client.ERROR_EVENT, err => {
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
* @param options.interval How long to refresh the configuration. (millisecond)

### client.on(event, callback)

* @param event Client.REFRESH_ALL_EVENT, Client.ERROR_EVENT or the key of your configuration.
* @param callback
* @param callback(value) If the event is ERROR_EVENT, value will be err.