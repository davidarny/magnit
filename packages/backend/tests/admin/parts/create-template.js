"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let json = require("./data.json");

    async function onTemplateCreate(httpResponse, body) {
        assert.equal(httpResponse.statusCode, 200);
        assert.equal(body.success, 1);
        assert.equal(body.message, "Ok");

        const rootPuzzles = await Puzzle.find({ parent_id: null });
        assert.equal(rootPuzzles.length, 2);
        assert.equal(rootPuzzles[0].title, "Основная группа вопросов");
        assert.equal(rootPuzzles[0].parent_id, null);
        assert.equal(rootPuzzles[0].order, 0);
        assert.equal(rootPuzzles[0].puzzle_type, "group");
        assert.equal(rootPuzzles[0].answer_type, null);
        assert.equal(rootPuzzles[1].title, "Необходимость парковки");
        assert.equal(rootPuzzles[1].order, 1);
        assert.equal(rootPuzzles[1].puzzle_type, "group");

        const puzzles = await Puzzle.find();
        assert.equal(puzzles.length, 18);
        assert.equal(puzzles[1].template_id, 1);
        assert.equal(puzzles[1].section_id, 1);
        assert.equal(puzzles[1].parent_id, 1);
        assert.equal(puzzles[1].title, "Нужна парковка?");
        assert.equal(puzzles[1].description, null);
        assert.equal(puzzles[1].puzzle_type, "question");
        assert.equal(puzzles[1].order, 0);
        assert.equal(puzzles[2].parent_id, 2);
        assert.equal(puzzles[2].title, "Да");
        assert.equal(puzzles[2].puzzle_type, "radio_answer");
        assert.equal(puzzles[2].order, 0);
        assert.equal(puzzles[3].parent_id, 2);
        assert.equal(puzzles[3].title, "Нет");
        assert.equal(puzzles[3].puzzle_type, "radio_answer");
        assert.equal(puzzles[3].order, 1);
        assert.equal(puzzles[4].parent_id, 1);
        assert.equal(puzzles[4].title, "Нужен тротуар?");
        assert.equal(puzzles[4].puzzle_type, "question");
        assert.equal(puzzles[4].order, 1);
        assert.equal(puzzles[5].parent_id, 5);
        assert.equal(puzzles[5].order, 0);
        assert.equal(puzzles[6].parent_id, 5);
        assert.equal(puzzles[6].order, 1);
        assert.equal(puzzles[8].parent_id, 8);
        assert.equal(puzzles[8].title, "Выберите тип покрытия парковки");
        assert.equal(puzzles[8].puzzle_type, "question");
        assert.equal(puzzles[8].order, 0);
        assert.equal(puzzles[9].parent_id, 9);
        assert.equal(puzzles[9].title, "Асфальт в один слой");
        assert.equal(puzzles[9].puzzle_type, "dropdown_answer");
        assert.equal(puzzles[9].order, 0);
        assert.equal(puzzles[10].parent_id, 9);
        assert.equal(puzzles[10].title, "Асфальт в два слоя");
        assert.equal(puzzles[10].puzzle_type, "dropdown_answer");
        assert.equal(puzzles[10].order, 1);
        assert.equal(puzzles[11].parent_id, 9);
        assert.equal(puzzles[11].title, "Бортовой камень");
        assert.equal(puzzles[11].puzzle_type, "dropdown_answer");
        assert.equal(puzzles[11].order, 2);
        assert.equal(puzzles[12].parent_id, 8);
        assert.equal(puzzles[12].title, "Введите длину покрытия парковки");
        assert.equal(puzzles[12].puzzle_type, "question");
        assert.equal(puzzles[12].order, 1);
        assert.equal(puzzles[13].parent_id, 13);
        assert.equal(puzzles[13].title, "");
        assert.equal(puzzles[13].puzzle_type, "input_answer");
        assert.equal(puzzles[13].order, 0);
        assert.equal(puzzles[13].answer_type, "number");
        assert.equal(puzzles[14].parent_id, 8);
        assert.equal(puzzles[14].title, "Введите площадь объекта");
        assert.equal(puzzles[14].puzzle_type, "question");
        assert.equal(puzzles[14].order, 2);
        assert.equal(puzzles[15].parent_id, 15);
        assert.equal(puzzles[15].title, "");
        assert.equal(puzzles[15].puzzle_type, "input_answer");
        assert.equal(puzzles[15].order, 0);
        assert.equal(puzzles[15].answer_type, "number");
        assert.equal(puzzles[16].parent_id, 8);
        assert.equal(puzzles[16].title, "Введите площадь торгового зала");
        assert.equal(puzzles[16].puzzle_type, "question");
        assert.equal(puzzles[16].order, 3);
        assert.equal(puzzles[17].parent_id, 17);
        assert.equal(puzzles[17].title, "");
        assert.equal(puzzles[17].puzzle_type, "input_answer");
        assert.equal(puzzles[17].order, 0);
        assert.equal(puzzles[17].answer_type, "number");
    }

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

                    await onTemplateCreate(httpResponse, body);

                    options.json = { template: json };

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        // it("valid json", done => {
        //     request(options, async (err, httpResponse, body) => {
        //         try {
        //             if (err) {
        //                 throw err;
        //             }
        //
        //             await onTemplateCreate(httpResponse, body);
        //
        //             return done();
        //         } catch (err) {
        //             return done(err);
        //         }
        //     });
        // });
    });
};
