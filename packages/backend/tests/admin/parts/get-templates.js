"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#get-templates", () => {
        let options = {
            uri: `${host}/v1/templates`,
            method: "GET",
        };

        before(async () => {
            for (let i = 0; i < 27; i++) {
                await Template.create({
                    title: `title ${i}`,
                    description: `description ${i}`,
                });
            }
        });

        it("get first 10 templates (asc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.total, 28);

                    assert.equal(body.templates.length, 10);
                    assert.equal(body.templates[0].title, "title 0");
                    assert.equal(body.templates[0].description, "description 0");
                    assert.equal(body.templates[1].title, "title 1");
                    assert.equal(body.templates[1].description, "description 1");
                    assert.equal(body.templates[9].title, "title 17");
                    assert.equal(body.templates[9].description, "description 17");

                    options.uri = `${host}/v1/templates?offset=7&limit=10`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get templates from 8 to 18 (asc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.total, 28);

                    assert.equal(body.templates.length, 10);
                    assert.equal(body.templates[0].title, "title 15");
                    assert.equal(body.templates[0].description, "description 15");
                    assert.equal(body.templates[1].title, "title 16");
                    assert.equal(body.templates[1].description, "description 16");
                    assert.equal(body.templates[9].title, "title 23");
                    assert.equal(body.templates[9].description, "description 23");

                    options.uri = `${host}/v1/templates?offset=7&limit=10&sort=DESC`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get templates from 8 to 18 (desc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.total, 28);

                    assert.equal(body.templates.length, 10);
                    assert.equal(body.templates[0].title, "title 3");
                    assert.equal(body.templates[0].description, "description 3");
                    assert.equal(body.templates[1].title, "title 26");
                    assert.equal(body.templates[1].description, "description 26");
                    assert.equal(body.templates[9].title, "title 19");
                    assert.equal(body.templates[9].description, "description 19");

                    options.uri = `${host}/v1/templates?title=${encodeURIComponent(
                        "Ведомость работ"
                    )}`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get template(s) by title", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);
                    assert.equal(body.total, 1);

                    assert.equal(body.templates.length, 1);
                    assert.equal(body.templates[0].title, "Ведомость работ");
                    assert.equal(body.templates[0].description, null);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        after(async () => {
            await Template.destroy({
                id: { ">": 1 },
            });
        });
    });
};
