# NodeCloud-Config-Client

This is a client for springcloud-config-server written by node.

## Usage
```
npm install nodecloud-config-client --save
```

```javascript
import Client, {CONFIG_REFRESH_EVENT, ERROR_EVENT} from 'nodecloud-config-client';
import path from 'path';

const client = new Client({
    remote: {
        url: 'http://localhost:8888/:service/:env',
        service: 'service',
        interval: 60000,
        watch: false
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
* @param options.remote.url (params: {service, env})
* @param options.remote.client Custom http client. It's an object implement send method with promisify.
* @param options.remote.service The name of the service.
* @param options.remote.interval How long to refresh the configuration, default is one minute.(millisecond)
* @param options.remote.watch

* @param options.local.path The position of the local config file.
* @param options.local.service The name of the service.
* @param options.local.ext The file type of the configuration, supports js or yml.

### client.on(eventName, callback)

* CONFIG_REFRESH_EVENT
* ERROR_EVENT
* Your configuration path

### await client.getConfig()

### await client.getConfig(path, defaultValue)

### client.destroy()

## Custom http client

```
import rp from 'request-promise';

const options = {
    remote: {
        client: {
            send(request) {
                //compile uri params.
                request.url = uriParams(request.url, request.params);

                //force setting the config.
                request.simple = true;
                request.json = true;
                request.resolveWithFullResponse = false;
                return rp(request);
            }
        }
    }
}
```