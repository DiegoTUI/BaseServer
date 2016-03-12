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
        User.removeAsync({email: 'test@example.com'}).then(done);
    });

    beforeEach(() => {
        genUser();
    });

    afterEach((done) => {
        User.removeAsync({email: 'test@example.com'}).then(done);
    });

    it('should begin with no test users', (done) => {
        User.findAsync({email: 'test@example.com'})
        .then(users => {
            expect(users.length).toBe(0);
            done();
        });
    });

    it('should fail when saving a duplicate user', (done) => {
        user.saveAsync()
        .then(() => {
            var userDup = genUser();
            userDup.saveAsync()
            .catch(error => {
                expect(error).toBeDefined();
                done();
            });
        });
    });

    describe('#email', () => {
        it('should fail when saving without an email', (done) => {
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
            user.saveAsync().then(done);
        });

        it('should authenticate user if valid', (done) => {
            user.authenticate('password')
            .then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it('should not authenticate user if invalid', (done) => {
            user.authenticate('blah')
            .then(result => {
                expect(result).toBe(true);
                done();
            });
        });

        it('should remain the same hash unless the password is updated', (done) => {
            user.name = 'Test User';
            user.saveAsync()
            .spread(function(u) {
                u.authenticate('password')
                .then(result => {
                    expect(result).toBe(true);
                    done();
                });
            });
        });
    });
});
