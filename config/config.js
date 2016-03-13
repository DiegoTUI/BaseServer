'use strict';

var path = require('path');

/**
 * BaseServer configuration object.
 * @namespace {object} config
 * PENDING DOCS
 */

var _ = require('lodash');
var localConfig = require('../config.json');

// Read global config file, override main file
try {
    var home = process.env.HOME || process.env.USERPROFILE;
    var globalJson = require(home + '/.baseserver.json');
    _.merge(localConfig, globalJson);
} catch (err) {
    // do nothing
}

// Read local config file, override main file
try {
    var localJson = require('../local_config.json');
    _.merge(localConfig, localJson);
} catch (err) {
    // do nothing
}

// set root
localConfig.root = path.normalize(__dirname + '/..');

module.exports = localConfig;
