'use strict';

var User = require('./user.model');
var user;
var genUser = function() {
    user = new User({
        provider: 'local',
        name: 'Fake User',
        email: 'test@example.com',
        password: 'password'
    });
    return user;
};

describe('User Model', () => {

    beforeAll((done) => {
        User.removeAsync()
        .then(done);
    });

    beforeEach(() => {
        genUser();
    });

    afterEach((done) => {
        User.removeAsync()
        .then(done);
    });

    it('should begin with no test users', (done) => {
        User.findAsync()
        .then(users => {
            expect(users.length).toBe(0);
            done();
        });
    });

    xit('should fail when saving a duplicate user', (done) => {
        user.saveAsync()
        .then(() => {
            var userDup = genUser();
            userDup.saveAsync()
            .catch(error => {
                expect(error).toBeDefined();
                return done();
            });
        })
        .catch(err => {
            console.error(err);
        });
    });

    describe('#email', () => {
        xit('should fail when saving without an email', (done) => {
            user.email = '';
            user.saveAsync()
            .catch(error => {
                expect(error).toBeDefined();
                done();
            });
        });
    });

    describe('#password', () => {
        beforeEach((done) => {
            user.saveAsync()
            .then(done);
        });

        it('should authenticate user if valid', (done) => {
            user.authenticate('password', (error, result) => {
                expect(error).toBeNull();
                expect(result).toBe(true);
                done();
            });
        });

        it('should not authenticate user if invalid', (done) => {
            user.authenticate('blah', (error, result) => {
                expect(error).toBeNull();
                expect(result).toBe(false);
                done();
            });
        });

        it('should remain the same hash unless the password is updated', (done) => {
            user.name = 'Test User';
            user.saveAsync()
            .spread(function(u) {
                u.authenticate('password', (error, result) => {
                    expect(error).toBeNull();
                    expect(result).toBe(true);
                    done();
                });
            });
        });
    });
});
