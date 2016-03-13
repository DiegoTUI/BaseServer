'use strict';

// Include the cluster module
var cluster = require('cluster');
var log = require('../utils/log');

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function(worker) {

        // Replace the dead worker, we're not sentimental
        log.info('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

 // Code to run if we're in a worker process
} else {

    require('./single');
    log.info('Worker ' + cluster.worker.id + ' running!');
}
