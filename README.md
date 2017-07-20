# node-cloud-config-client

This is a client for spring-cloud-config-server written by node.

## Usage
```
npm install nodecloud-config-client --save
```

```javascript
import Client, {CONFIG_REFRESH_EVENT, ERROR_EVENT} from 'nodecloud-config-client';
import path from 'path';

const client = new Client({
    remote: {
        host: '127.0.0.1',
        port: 8888,
        service: 'service',
        interval: 60000
    },
    local: {
        path: path.resolve(__dirname),
        service: 'service',
        ext: 'yml'
    }
});

client.on(CONFIG_REFRESH_EVENT, config => {
    console.log(config);
});

client.on("web.port", port => {
    console.log('The port is ' + port);
});

client.on(ERROR_EVENT, err => {
    console.log(err);
});
```

## API

### new ConfigClient(options)

* @param options
* @param options.remote.host The host of spring-cloud-config-server.
* @param options.remote.port The port of spring-cloud-config-server.
* @param options.remote.service The name of the service.
* @param options.remote.interval How long to refresh the configuration, default is one minute.(millisecond)
* @param options.local.path The position of the local config file.
* @param options.local.service The name of the service
* @param options.local.ext The file type of the configuration, supports js or yml.

### client.on(eventName, callback)

### client.getConfig()

### client.getConfig(path, defaultValue)

### client.destroy()