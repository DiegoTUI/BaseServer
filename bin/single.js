'use strict';
/*
 * Module dependencies.
 */

var app = require('../app');
var log = require('../utils/log');

app.startApp(function(error, address) {
    var bind;
    if (error) {
        if (error.syscall !== 'listen') {
            throw error;
        }

        bind = typeof address.port === 'string' ? 'Pipe ' + address.port : 'Port ' + address.port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                log.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                log.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    } else {
        bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
        log.info('Listening on ' + bind);
    }
});

