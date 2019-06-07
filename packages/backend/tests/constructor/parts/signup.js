"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let token;

    describe("#signup", () => {
        it("tmp test", async done => {
            await sails
                .getDatastore()
                .sendNativeQuery(
                    `INSERT INTO templates (title, description) VALUES ('title', 'description')`
                );
            // await sails.getDatastore().sendNativeQuery(`SELECT * FROM puzzles`);

            assert.equal(1, 1);
            return done();
        });
    });
};
