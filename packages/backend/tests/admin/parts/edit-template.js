"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let json = require("./../assets/data_updated.json");

    describe("#edit-template", () => {
        let options = {
            uri: `${host}/v1/templates/16`,
            method: "PUT",
        };

        options.json = { template: JSON.stringify(json) };

        it("should not edit (template not found)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

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

        it("should edit template", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);

                    let templates = await Template.find();
                    let sections = await Section.find();
                    let puzzles = await Puzzle.find();
                    let conditions = await Condition.find();
                    let validations = await Validation.find();

                    assert.equal(templates.length, 1);
                    assert.equal(sections.length, 1);
                    assert.equal(puzzles.length, 25);
                    assert.equal(conditions.length, 5);
                    assert.equal(validations.length, 2);

                    assert.equal(puzzles[1].title, "Нужна паркофффка?");

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
