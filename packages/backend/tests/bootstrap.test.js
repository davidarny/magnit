var sails = require("sails");

before(done => {
    sails.lift(
        {
            // configuration for testing purposes
        },
        (err /*, server*/) => {
            if (err) {
                return done(err);
            }
            // here you can load fixtures, etc.
            done(err, sails);
        }
    );
});

after(done => {
    // here you can clear fixtures, etc.
    sails.lower(done);
});
