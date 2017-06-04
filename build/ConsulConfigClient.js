'use strict';

/**
 * Created by feng on 2017/6/4.
 */
try {
    KeystoneEmail = require('node-cloud-loadbalance');
} catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
        throw new Error('The "keystone-email" package needs to be installed to send emails');
    } else {
        throw err;
    }
}