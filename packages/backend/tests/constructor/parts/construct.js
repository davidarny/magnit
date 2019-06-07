"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let json = require("./data.json");

    describe("#construct", () => {
        it("tmp test", done => {
            async function run() {
                // await sails.getDatastore().sendNativeQuery(`INSERT INTO templates (title, description) VALUES ('title', 'description')`);
                // await sails.getDatastore().sendNativeQuery(`INSERT INTO templates (title, description) VALUES ('title', 'description')`);
                // console.log(json);

                assert.equal(1, 1);
                return done();
            }

            run();
        });
    });
};
