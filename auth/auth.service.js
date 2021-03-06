'use strict';

/**
 * Auth utilities
 * @module utils/auth
 */

var config = require('../config/config');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');

var validateJwt = expressJwt({
    secret: config.secrets.session
});

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
exports.isAuthenticated = function() {
    return compose()

    // Validate jwt
    .use(function(req, res, next) {
        // allow accesstoken to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('accesstoken')) {
            req.headers.authorization = 'Bearer ' + req.query.accesstoken;
        }

        validateJwt(req, res, next);
    })

    // Attach user to request
    .use(function(req, res, next) {
        User.findByIdAsync(req.user._id)
        .then(user => {
            if (!user) {
                return res.status(401).end();
            }

            req.user = user;
            next();
        })
        .catch(err => {
            next(err);
        });
    });
};

/**
 * Checks if the user role meets the minimum requirements of the route
 */
exports.hasRole = function(roleRequired) {
    if (!roleRequired) {
        throw new Error('Required role needs to be set');
    }

    return compose()
    .use(exports.isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
        if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    });
};

/**
 * Returns a jwt token signed by the app secret
 */
exports.signToken = function(id, role) {
    return jwt.sign({ _id: id, role: role }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
    });
};

/**
 * Set token cookie directly for oAuth strategies
 */
exports.setTokenCookie = function(req, res) {
    if (!req.user) {
        return res.status(404).send('It looks like you aren\'t logged in, please try again.');
    }

    var token = exports.signToken(req.user._id, req.user.role);
    res.cookie('token', token);
    res.redirect('/');
};
