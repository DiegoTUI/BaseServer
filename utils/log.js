'use strict';
/**
 * Logs utilities
 * @module utils/log
 */

/** Configures a logger module with the information passed as parameter.<br>
 * It can configure several logging transports as defined in the
 * wiston module:<br><br> https://github.com/winstonjs/winston
 * <br><br>
 * Log levels admited:
 * <ul>
 *     <li>debug</li>
 *     <li>info</li>
 *     <li>warn</li>
 *     <li>error</li>
 * </ul>
 * @example
 * // Standard log function
 *
 *   logger.log('debug', "127.0.0.1 - there's no place like home");
 *   logger.log('info', "127.0.0.1 - there's no place like home");
 *   logger.log('warn', "127.0.0.1 - there's no place like home");
 *   logger.log('error', "127.0.0.1 - there's no place like home");
 *
 * //An optional JSON parameter can be appended at the end of the function
 *   logger.log('info', "127.0.0.1 - there's no place like home", {address: "Nice place St."});
 *
 * // Examples with the helper functions
 *   logger.error("127.0.0.1 - there's no place like home");
 *   logger.debug("127.0.0.1 - there's no place like home");
 *   logger.info("127.0.0.1 - there's no place like home");
 *   logger.warn("127.0.0.1 - there's no place like home");
 *
 * // An optional JSON parameter can be appended at the end of the helper functions
 *   logger.info("127.0.0.1 - there's no place like home", {address: "Nice place St."});
 *
 *
 * @param {object} logConfig the configuration object
 * @param {array} logConfig.transports an array of transports as defined in the Winston package.
 * Each element of the array must have two properties:
 * <ul>
 *     <li><b>name</b>: The name of the winston transport. Currently: Console, File, DailyRotateFile
 *     <li><b>options</b>: The different options for each transport (check https://github.com/winstonjs/winston)
 * </ul>
 * @returns {object} the logger.
 */
var config = require('../config/config');
var logFortesting = {
    transports: [
        {
            type: 'Console',
            options: {
                level: 'fatal',
                colorize: 'all'
            }
        }
    ]
};

config.log = process.env.NODE_ENV === 'test' ? logFortesting : config.log;

module.exports = (function(logConfig) {

    var winston = require('winston');
    var fs = require('fs');
    var path = require('path');

    /**
     * Creates the given directory if it does not exist
     *
     * @property {string} dirPath A string with the directory path
     */
    function createDirectoryIfNotExists(dirPath) {
        if (!fs.existsSync(dirPath)) {
            mkdirSync(dirPath);
        }
    }

    /**
     * Recursively creates the given directory path
     *
     * @property {string} path A string with the relative directory path
     * @property {string} [root] The root of the directory structure
     * @returns {boolean}
     */
    function mkdirSync(path, root) {

        var dirs = path.split('/');
        var dir = dirs.shift();
        root = (root || '') + dir + '/';

        try {
            fs.mkdirSync(root);
        }
        catch (e) {
            //dir wasn't made, something went wrong
            if (!fs.statSync(root).isDirectory()) {
                throw new Error(e);
            }
        }

        return !dirs.length || mkdirSync(dirs.join('/'), root);
    }

    /**
     * Configures the transports passed as parameters.
     *
     * View: https://github.com/winstonjs/winston
     *
     * for configuration of each transport
     */
    var transports = logConfig.transports.map(function(transportConfig) {

        switch (transportConfig.type) {
            case 'Console':

                // { level: 'debug', colorize: 'all' }
                return new (winston.transports.Console)(transportConfig.options);

            case 'File':

                // { level: 'error', filename: 'somefile.log' }

                // Make sure that the base dir for logs exists
                createDirectoryIfNotExists(path.dirname(__dirname + '/../' + transportConfig.options.filename));

                return new (winston.transports.File)(transportConfig.options);

            case 'DailyRotateFile':

                // { level: 'error', name: 'file', datePattern: '.yyyyMMdd', filename: path.join("logs", "log_file.log") }

                // Make sure that the base dir for logs exists
                createDirectoryIfNotExists(path.dirname(__dirname + '/../' + transportConfig.options.filename));

                return new (winston.transports.DailyRotateFile)(transportConfig.options);

            case 'Mail':
                var Mail = require('winston-mail').Mail;
                return new (Mail)(transportConfig.options);

            default:
                return new (winston.transports.Console)({level: 'debug', colorize: 'all'});
        }
    });

    var customLevels = {levels: {debug: 1, info: 3, warn: 4, error: 5, notification: 6}};
    winston.addColors({notification: 'red'});

    return new (winston.Logger)({transports: transports, exitOnError: false, levels: customLevels.levels});
})(config.log);
