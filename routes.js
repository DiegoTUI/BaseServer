/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';

export default function(app) {
    // Insert routes below
    //app.use('/api/users', require('./api/user'));

    //app.use('/auth', require('./auth'));

    // All undefined asset or api routes should return a 404
    app.route('/*')
     .get(errors[404]);
}
