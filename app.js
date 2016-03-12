/**
 * Main application file
 */

'use strict';

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var config = require('./config/config');
var http = require('http');

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
exports.startApp = function(callback) {
    server.listen(config.port[env]);
    server.on('error', onError);
    server.on('listening', onListening);

    function onError(error) {
        return callback(error, server.address());
    }

    function onListening() {
        return callback(null, server.address());
    }
};

// Start server
exports.stopApp = function(callback) {
    server.close(callback);
};
