/**
 * Express configuration
 */

'use strict';

var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var config = require('./config');
var passport = require('passport');
var session = require('express-session');
var connectMongo = require('connect-mongo');
var mongoose = require('mongoose');
var MongoStore = connectMongo(session);

module.exports = function(app) {
    var env = app.get('env');

    app.set('views', config.root + '/views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(passport.initialize());

    // Persist sessions with mongoStore / sequelizeStore
    // We need to enable sessions for passport-twitter because it's an
    // oauth 1.0 strategy, and Lusca depends on sessions
    app.use(session({
        secret: config.secrets.session,
        saveUninitialized: true,
        resave: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            db: 'quejicas'
        })
    }));

    /**
     * Lusca - express server security
     * https://github.com/krakenjs/lusca
     */
    if (env !== 'test') {
        app.use(lusca({
            csrf: {
                angular: true
            },
            xframe: 'SAMEORIGIN',
            hsts: {
                maxAge: 31536000, //1 year, in seconds
                includeSubDomains: true,
                preload: true
            },
            xssProtection: true
        }));
    }

    if (env === 'production') {
        app.use(morgan('dev'));
    }

    if (env === 'development' || env === 'test') {
        app.use(morgan('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
}
