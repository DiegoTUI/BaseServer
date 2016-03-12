'use strict';

var app = require('../../app');
var request = require('request');

var newThing;
var homeUrl;

describe('Thing API:', () => {

    beforeAll((done) => {
        app.startApp(function(error, address) {
            if (error) {
                console.error('Error opening the app', error);
            }

            homeUrl = 'http://localhost:' + address.port;
            done();
        });
    });

    afterAll(function(done) {
        app.stopApp(function(error) {
            if (error) {
                console.error('Error closing the app', error);
            }

            done();
        });
    });

    describe('POST /api/things', () => {
        beforeEach((done) => {
            var options = {
                url: homeUrl + '/api/things',
                method: 'POST',
                json: {
                    name: 'New Thing',
                    info: 'This is the brand new thing!!!'
                }
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(201);
                expect(response.headers['content-type']).toContain('application/json');
                newThing = body;
                done();
            });
        });

        it('should respond with the newly created thing', () => {
            expect(newThing.name).toBe('New Thing');
            expect(newThing.info).toBe('This is the brand new thing!!!');
        });
    });

    describe('GET /api/things', () => {
        var things;

        beforeEach((done) => {
            var options = {
                url: homeUrl + '/api/things',
                method: 'GET',
                json: true
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                things = body;
                done();
            });
        });

        it('should respond with JSON array', () => {
            expect(things instanceof Array).toBe(true);
            expect(things.length).toBeGreaterThan(0);
        });
    });

    describe('GET /api/things/:id', () => {
        var thing;

        beforeEach((done) => {
            var options = {
                url: homeUrl + '/api/things/' + newThing._id,
                method: 'GET',
                json: true
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                thing = body;
                done();
            });
        });

        afterEach(() => {
            thing = {};
        });

        it('should respond with the requested thing', () => {
            expect(thing.name).toBe('New Thing');
            expect(thing.info).toBe('This is the brand new thing!!!');
        });
    });

    describe('PUT /api/things/:id', () => {
        var updatedThing;

        beforeEach((done) => {
            var options = {
                url: homeUrl + '/api/things/' + newThing._id,
                method: 'PUT',
                json: {
                    name: 'Updated Thing',
                    info: 'This is the updated thing!!!'
                }
            };
            request(options, (error, response, body) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(200);
                expect(response.headers['content-type']).toContain('application/json');
                updatedThing = body;
                done();
            });
        });

        afterEach(() => {
            updatedThing = {};
        });

        it('should respond with the updated thing', () => {
            expect(updatedThing.name).toBe('Updated Thing');
            expect(updatedThing.info).toBe('This is the updated thing!!!');
        });

    });

    describe('DELETE /api/things/:id', () => {

        it('should respond with 204 on successful removal', (done) => {
            var options = {
                url: homeUrl + '/api/things/' + newThing._id,
                method: 'DELETE'
            };
            request(options, (error, response) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(204);
                done();
            });
        });

        it('should respond with 404 when thing does not exist', (done) => {
            var options = {
                url: homeUrl + '/api/things' + newThing._id,
                method: 'DELETE'
            };
            request(options, (error, response) => {
                expect(error).toBeNull();
                expect(response.statusCode).toBe(404);
                done();
            });
        });
    });
});
