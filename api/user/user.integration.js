'use strict';

var app = require('../../app');
var request = require('request');
var User = require('./user.model');

describe('User API:', () => {
    var user;
    var homeUrl;

    // Clear test users before testing
    beforeAll((done) => {
        app.startApp(function(error, address) {
            if (error) {
                console.error('Error opening the app', error);
            }

            homeUrl = 'http://localhost:' + address.port;

            User.removeAsync().then(() => {
                user = new User({
                    name: 'Fake User',
                    email: 'test@example.com',
                    password: 'password'
                });

                user.saveAsync()
                .then(done)
                .catch((err) => {
                    console.error(err);
                });
            })
            .catch((err) => {
                console.error(err);
            });
        });
    });

    // Clear users after testing
    afterAll((done) => {
        User.removeAsync()
        .then(() => {
            app.stopApp(function(error) {
                if (error) {
                    console.error('Error closing the app', error);
                }

                done();
            });
        })
        .catch((err) => {
            console.error(err);
        });
    });

    describe('GET /api/users/me', () => {
        var token;

        beforeAll((done) => {
            var options = {
                url: homeUrl + '/auth/local',
                method: 'POST',
                json: {
                    email: 'test@example.com',
                    password: 'password'
                }
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                token = body.token;
                done();
            });
        });

        it('should respond with a user profile when authenticated', (done) => {
            var options = {
                url: homeUrl + '/api/users/me',
                method: 'GET',
                headers: {
                    authorization: 'Bearer ' + token
                },
                json: true
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                expect(body._id.toString()).toBe(user._id.toString());
                done();
            });
        });

        it('should respond with a 401 when not authenticated', (done) => {
            var options = {
                url: homeUrl + '/api/users/me',
                method: 'GET',
                json: true
            };
            request(options, (error, response) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(401);
                done();
            });
        });
    });
});
