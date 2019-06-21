"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#delete-template", () => {
        let options = {
            uri: `${host}/v1/templates/55`,
            method: "DELETE",
        };

        it("should not delete (not found)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 404);
                    assert.equal(body.success, 0);
                    assert.equal(body.message, "template does not exist");

                    options.uri = `${host}/v1/templates/1`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("should delete template with id 1 cascade", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);

                    const templatesCount = await Template.count();
                    const sectionsCount = await Section.count();
                    const puzzlesCount = await Puzzle.count();
                    const conditionsCount = await Condition.count();
                    const validationsCount = await Validation.count();

                    assert.equal(templatesCount, 0);
                    assert.equal(sectionsCount, 0);
                    assert.equal(puzzlesCount, 0);
                    assert.equal(conditionsCount, 0);
                    assert.equal(validationsCount, 0);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
