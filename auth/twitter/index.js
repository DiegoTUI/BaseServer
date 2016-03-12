'use strict';

var express = require('express');
var passport = require('passport');
var setTokenCookie = require('../auth.service').setTokenCookie;

var router = express.Router();

router
.get('/', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
}))
.get('/callback', passport.authenticate('twitter', {
    failureRedirect: '/signup',
    session: false
}), setTokenCookie);

module.exports = router;
