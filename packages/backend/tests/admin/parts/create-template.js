"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let json = require("./data.json");

    describe("#create-template", () => {
        let options = {
            uri: `${host}/v1/templates`,
            method: "POST",
        };

        options.json = { template: "not valid json" };

        it("not valid json", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    assert.equal(httpResponse.statusCode, 400);
                    assert.equal(body.success, 0);
                    assert.equal(body.message, "Not valid JSON");

                    options.json = { template: JSON.stringify(json) };

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("valid stringified json", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.message, "Ok");

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("valid json", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.message, "Ok");

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
