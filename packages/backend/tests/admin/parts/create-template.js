"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    let json = require("./../assets/data.json");

    async function onTemplateCreate(httpResponse, body) {
        assert.equal(httpResponse.statusCode, 200);
        assert.equal(body.success, 1);
        assert.equal(body.template_id, 1);

        const rootPuzzles = await Puzzle.find({ parent_id: null });
        assert.equal(rootPuzzles.length, 3);
        assert.equal(rootPuzzles[0].title, "Основная группа вопросов");
        assert.equal(rootPuzzles[0].parent_id, null);
        assert.equal(rootPuzzles[0].order, 0);
        assert.equal(rootPuzzles[0].puzzle_type, "group");
        assert.equal(rootPuzzles[0].answer_type, null);
        assert.equal(rootPuzzles[1].title, "Необходимость парковки");
        assert.equal(rootPuzzles[1].order, 1);
        assert.equal(rootPuzzles[1].puzzle_type, "group");

        const puzzles = await Puzzle.find();
        assert.equal(puzzles.length, 21);
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
        assert.equal(puzzles[13].title, null);
        assert.equal(puzzles[13].puzzle_type, "text_answer");
        assert.equal(puzzles[13].order, 0);
        assert.equal(puzzles[13].answer_type, "number");
        assert.equal(puzzles[13].uuid, "c047a25f-6d09-498a-b674-019c99c224f8");
        assert.equal(puzzles[14].parent_id, 8);
        assert.equal(puzzles[14].title, "Введите площадь объекта");
        assert.equal(puzzles[14].puzzle_type, "question");
        assert.equal(puzzles[14].order, 2);
        assert.equal(puzzles[15].parent_id, 15);
        assert.equal(puzzles[15].title, null);
        assert.equal(puzzles[15].puzzle_type, "text_answer");
        assert.equal(puzzles[15].order, 0);
        assert.equal(puzzles[15].answer_type, "number");
        assert.equal(puzzles[16].parent_id, 8);
        assert.equal(puzzles[16].title, "Введите площадь торгового зала");
        assert.equal(puzzles[16].puzzle_type, "question");
        assert.equal(puzzles[16].order, 3);
        assert.equal(puzzles[17].parent_id, 17);
        assert.equal(puzzles[17].title, null);
        assert.equal(puzzles[17].puzzle_type, "text_answer");
        assert.equal(puzzles[17].order, 0);
        assert.equal(puzzles[17].answer_type, "number");
        assert.equal(puzzles[17].uuid, "f1c77dcd-95a1-4cea-982f-ba3269365b2d");
        assert.equal(puzzles[18].parent_id, null);
        assert.equal(puzzles[18].title, "Нужен ремонт?");
        assert.equal(puzzles[18].puzzle_type, "question");
        assert.equal(puzzles[18].order, 0);
        assert.equal(puzzles[18].answer_type, null);
        assert.equal(puzzles[18].uuid, "f0dc6bef-1993-45aa-8df0-2dac0a32dcc0");
        assert.equal(puzzles[19].parent_id, 19);
        assert.equal(puzzles[19].uuid, "0cf23a3b-6c40-42eb-bcde-9d3f5a390812");
        assert.equal(puzzles[20].parent_id, 19);
        assert.equal(puzzles[20].uuid, "81b1b459-f738-4435-9aee-3baf576ae7d2");

        const conditions = await Condition.find();
        assert.equal(conditions.length, 4);
        assert.equal(conditions[0].puzzle_id, 8);
        assert.equal(conditions[0].order, 0);
        assert.equal(conditions[0].question_puzzle, "19972a9f-c592-4b7f-a64f-7a8034392586");
        assert.equal(conditions[0].action_type, "chosen_answer");
        assert.equal(conditions[0].answer_puzzle, "cea351b9-53cc-4325-8c22-a8448a451f54");
        assert.equal(conditions[0].value, null);
        assert.equal(conditions[0].condition_type, null);
        assert.equal(conditions[1].puzzle_id, 13);
        assert.equal(conditions[1].order, 0);
        assert.equal(conditions[1].question_puzzle, "21db1fb4-732a-423e-b4da-86ee1bc06d8f");
        assert.equal(conditions[1].action_type, "chosen_answer");
        assert.equal(conditions[1].answer_puzzle, "1a141ec2-ce6d-450d-9b66-f41da8ad041e");
        assert.equal(conditions[1].value, null);
        assert.equal(conditions[1].condition_type, "or");
        assert.equal(conditions[2].puzzle_id, 13);
        assert.equal(conditions[2].order, 1);
        assert.equal(conditions[2].question_puzzle, "21db1fb4-732a-423e-b4da-86ee1bc06d8f");
        assert.equal(conditions[2].action_type, "chosen_answer");
        assert.equal(conditions[2].answer_puzzle, "93cfa0af-0783-483a-8063-947296f36ee6");
        assert.equal(conditions[2].value, null);
        assert.equal(conditions[2].condition_type, "or");
        assert.equal(conditions[3].puzzle_id, 13);
        assert.equal(conditions[3].order, 2);
        assert.equal(conditions[3].question_puzzle, "21db1fb4-732a-423e-b4da-86ee1bc06d8f");
        assert.equal(conditions[3].action_type, "chosen_answer");
        assert.equal(conditions[3].answer_puzzle, "c34f2e08-39f4-4ec8-b879-8e3f5ca4ee5a");
        assert.equal(conditions[3].value, null);
        assert.equal(conditions[3].condition_type, null);

        const validations = await Validation.find();
        assert.equal(validations.length, 2);
        assert.equal(validations[0].puzzle_id, 17);
        assert.equal(validations[0].order, 0);
        assert.equal(validations[0].operator_type, "more_than");
        assert.equal(validations[0].validation_type, "compare_with_answer");
        assert.equal(validations[0].left_hand_puzzle, "09cf0415-57ec-4efb-a33e-a7da68faaba6");
        assert.equal(validations[0].right_hand_puzzle, "b0828257-4687-45de-8863-1aff3d1d0b50");
        assert.equal(validations[0].value, null);
        assert.equal(
            validations[0].error_message,
            "Ошибка! Площадь объекта не может быть больше площади торгового зала"
        );
        assert.equal(validations[1].puzzle_id, 17);
        assert.equal(validations[1].order, 1);
        assert.equal(validations[1].operator_type, "less_than");
        assert.equal(validations[1].validation_type, "set_value");
        assert.equal(validations[1].left_hand_puzzle, "b0828257-4687-45de-8863-1aff3d1d0b50");
        assert.equal(validations[1].right_hand_puzzle, null);
        assert.equal(validations[1].value, 100);
        assert.equal(
            validations[1].error_message,
            "Ошибка! Площадь объекта не может быть больше 100м*м"
        );

        const templates = await Template.find();
        assert.equal(templates.length, 1);
        assert.equal(templates[0].type, "complex");
        assert.equal(templates[0].title, "Ведомость работ");
        assert.equal(templates[0].description, null);

        const sections = await Section.find();
        assert.equal(sections.length, 1);
        assert.equal(sections[0].template_id, 1);
        assert.equal(sections[0].title, "Благоустройство");
        assert.equal(sections[0].description, null);
        assert.equal(sections[0].order, 0);
    }

    describe("#create-template", () => {
        let options = {
            uri: `${host}/v1/templates`,
            method: "POST",
        };

        options.json = { template: "not valid json" };
        //         options.json = {
        //   "template":{
        //      "id":"eaa4ccef-9fec-4902-b80b-b4886e36734a",
        //      "sections":[
        //         {
        //            "id":"b9248cc2-63c7-4a24-b53a-1c75c0ac84a6",
        //            "puzzles":[
        //               {
        //                  "id":"f178bd6b-b201-4520-87fa-306b3aa9562b",
        //                  "puzzles":[
        //                     {
        //                        "id":"bc1863f6-9668-471a-a9ff-2a765c76ebaa",
        //                        "puzzle_type":"text_answer",
        //                        "title":"",
        //                        "description":"",
        //                        "order":0,
        //                        "puzzles":[
        //
        //                        ],
        //                        "conditions":[
        //
        //                        ],
        //                        "validations":[
        //
        //                        ]
        //                     }
        //                  ],
        //                  "validations":[
        //
        //                  ],
        //                  "conditions":[
        //                     {
        //                        "id":"b41c52e9-003c-415c-abda-217428ec575a",
        //                        "order":0,
        //                        "question_puzzle":"",
        //                        "answer_puzzle":"",
        //                        "value":"",
        //                        "action_type":"",
        //                        "condition_type":"or"
        //                     }
        //                  ],
        //                  "title":"2",
        //                  "description":"",
        //                  "puzzle_type":"question",
        //                  "order":0
        //               }
        //            ],
        //            "title":"",
        //            "order":0
        //         }
        //      ],
        //      "title":"",
        //      "description":"",
        //      "type":"light"
        //   }
        // };

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

                    const config = JSON.parse(require("fs").readFileSync("config.json"), "utf8");
                    const postgresDb = config.postgresql_db;
                    const exec = require("child_process").execSync;
                    exec(`sudo -u postgres psql --quiet ${postgresDb} < stuff/magnit.sql`);

                    options.json = { template: json };

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

                    await onTemplateCreate(httpResponse, body);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
