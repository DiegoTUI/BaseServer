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
            console.log(homeUrl)
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

    xdescribe('GET /api/things', () => {
        var things;

        beforeEach((done) => {
            request(app.appObject)
                .get('/api/things')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    things = res.body;
                    done();
                });
        });

        it('should respond with JSON array', () => {
            expect(things instanceof Array).toBe(true);
            expect(things.length).toBeGreaterThan(0);
        });
    });

    xdescribe('GET /api/things/:id', () => {
        var thing;

        beforeEach((done) => {
            request(app.appObject)
                .get('/api/things/' + newThing._id)
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    thing = res.body;
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

    xdescribe('PUT /api/things/:id', () => {
        var updatedThing;

        beforeEach((done) => {
            request(app.appObject)
                .put('/api/things/' + newThing._id)
                .send({
                    name: 'Updated Thing',
                    info: 'This is the updated thing!!!'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }

                    updatedThing = res.body;
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
