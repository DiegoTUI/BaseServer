/**
 * Main application file
 */

'use strict';

require('babel-core/register');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/config';
import http from 'http';

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

// Populate databases with sample data
if (config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
app.set('env', env);
var server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
exports.startApp = function() {
    server.listen(config.port, function() {
        console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    });
};

exports.stopApp = function() {
    server.close(function() {
        console.log('Express server stopped on %d, in %s mode', config.port, app.get('env'));
    });
};
