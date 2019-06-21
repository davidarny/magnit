"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#get-template", () => {
        let options = {
            uri: `${host}/v1/templates/1`,
            method: "GET",
        };

        it("assemble template", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(httpResponse.statusCode, 200);
                    assert.equal(body.success, 1);

                    const template = JSON.parse(body.template);

                    assert.equal(template.title, "Ведомость работ");
                    assert.equal(template.description, null);

                    assert.equal(template.puzzles.length, 1);
                    assert.equal(template.puzzles[0].title, "Нужен ремонт?");
                    assert.equal(template.puzzles[0].description, null);
                    assert.equal(template.puzzles[0].order, 0);
                    assert.equal(template.puzzles[0].puzzle_type, "question");
                    assert.equal(template.puzzles[0].answer_type, null);
                    assert.equal(template.puzzles[0].id, "f0dc6bef-1993-45aa-8df0-2dac0a32dcc0");
                    assert.equal(template.puzzles[0].puzzles.length, 2);
                    assert.equal(template.puzzles[0].puzzles[0].title, "Да");
                    assert.equal(template.puzzles[0].puzzles[0].description, null);
                    assert.equal(template.puzzles[0].puzzles[0].order, 0);
                    assert.equal(template.puzzles[0].puzzles[0].puzzle_type, "radio_answer");
                    assert.equal(template.puzzles[0].puzzles[0].answer_type, null);
                    assert.equal(
                        template.puzzles[0].puzzles[0].id,
                        "0cf23a3b-6c40-42eb-bcde-9d3f5a390812"
                    );
                    assert.equal(template.puzzles[0].puzzles[1].title, "Нет");
                    assert.equal(template.puzzles[0].puzzles[1].description, null);
                    assert.equal(template.puzzles[0].puzzles[1].order, 1);
                    assert.equal(template.puzzles[0].puzzles[1].puzzle_type, "radio_answer");
                    assert.equal(template.puzzles[0].puzzles[1].answer_type, null);
                    assert.equal(
                        template.puzzles[0].puzzles[1].id,
                        "81b1b459-f738-4435-9aee-3baf576ae7d2"
                    );

                    assert.equal(template.sections.length, 1);
                    assert.equal(template.sections[0].title, "Благоустройство");
                    assert.equal(template.sections[0].description, null);
                    assert.equal(template.sections[0].order, 0);
                    assert.equal(template.sections[0].puzzles.length, 2);

                    assert.equal(
                        template.sections[0].puzzles[0].id,
                        "eeda3a44-a95e-4730-bed5-c48a8b2121fe"
                    );
                    assert.equal(template.sections[0].puzzles[0].title, "Основная группа вопросов");
                    assert.equal(template.sections[0].puzzles[0].description, null);
                    assert.equal(template.sections[0].puzzles[0].order, 0);
                    assert.equal(template.sections[0].puzzles[0].puzzle_type, "group");
                    assert.equal(template.sections[0].puzzles[0].answer_type, null);
                    assert.equal(template.sections[0].puzzles[0].puzzles.length, 2);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].id,
                        "19972a9f-c592-4b7f-a64f-7a8034392586"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].title,
                        "Нужна парковка?"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].description, null);
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].answer_type, null);
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].puzzles.length, 2);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[0].id,
                        "cea351b9-53cc-4325-8c22-a8448a451f54"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].puzzles[0].title, "Да");
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[0].puzzle_type,
                        "radio_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[0].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[0].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].id,
                        "59ec0a39-e3ff-4cc0-a326-8c5b1836a1a1"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].title,
                        "Нет"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[0].puzzles[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].puzzle_type,
                        "radio_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[0].puzzles[1].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].id,
                        "58ee9ffd-cdbf-4a52-a43d-4c5f7142057e"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].title,
                        "Нужен тротуар?"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].description, null);
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].answer_type, null);
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].puzzles.length, 2);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[0].id,
                        "e498d8f5-f156-4134-b5a5-d74d18a06c7a"
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].puzzles[0].title, "Да");
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[0].puzzle_type,
                        "radio_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[0].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[0].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].id,
                        "d358086d-8340-49b0-922e-81476d6c6147"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].title,
                        "Нет"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[0].puzzles[1].puzzles[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].puzzle_type,
                        "radio_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[0].puzzles[1].puzzles[1].puzzles,
                        undefined
                    );

                    assert.equal(
                        template.sections[0].puzzles[1].id,
                        "faf6cea0-05e1-4577-b09e-3c2b00ff4319"
                    );
                    assert.equal(template.sections[0].puzzles[1].title, "Необходимость парковки");
                    assert.equal(template.sections[0].puzzles[1].description, null);
                    assert.equal(template.sections[0].puzzles[1].order, 1);
                    assert.equal(template.sections[0].puzzles[1].puzzle_type, "group");
                    assert.equal(template.sections[0].puzzles[1].answer_type, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles.length, 4);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].id,
                        "21db1fb4-732a-423e-b4da-86ee1bc06d8f"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].title,
                        "Выберите тип покрытия парковки"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].description, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].answer_type, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].puzzles.length, 3);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].id,
                        "1a141ec2-ce6d-450d-9b66-f41da8ad041e"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].title,
                        "Асфальт в один слой"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].puzzle_type,
                        "dropdown_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[0].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].id,
                        "93cfa0af-0783-483a-8063-947296f36ee6"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].title,
                        "Асфальт в два слоя"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].puzzles[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].puzzle_type,
                        "dropdown_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[1].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].id,
                        "c34f2e08-39f4-4ec8-b879-8e3f5ca4ee5a"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].title,
                        "Бортовой камень"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[0].puzzles[2].order, 2);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].puzzle_type,
                        "dropdown_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].answer_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[0].puzzles[2].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].id,
                        "5f22a757-b949-48e8-9989-b698b8ddef74"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].title,
                        "Введите длину покрытия парковки"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].description, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].answer_type, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].puzzles.length, 1);
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].conditions.length, 3);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].id,
                        "c047a25f-6d09-498a-b674-019c99c224f8"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].puzzles[0].title, null);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].puzzle_type,
                        "input_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].answer_type,
                        "number"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].puzzles,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].conditions,
                        undefined
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].puzzles[0].validations,
                        undefined
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].conditions[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[0].question_puzzle,
                        "21db1fb4-732a-423e-b4da-86ee1bc06d8f"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[0].answer_puzzle,
                        "1a141ec2-ce6d-450d-9b66-f41da8ad041e"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[0].action_type,
                        "chosen_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[0].condition_type,
                        "or"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[0].value,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].conditions[1].order, 1);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[1].question_puzzle,
                        "21db1fb4-732a-423e-b4da-86ee1bc06d8f"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[1].answer_puzzle,
                        "93cfa0af-0783-483a-8063-947296f36ee6"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[1].action_type,
                        "chosen_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[1].condition_type,
                        "or"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[1].value,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[1].conditions[2].order, 2);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[2].question_puzzle,
                        "21db1fb4-732a-423e-b4da-86ee1bc06d8f"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[2].answer_puzzle,
                        "c34f2e08-39f4-4ec8-b879-8e3f5ca4ee5a"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[2].action_type,
                        "chosen_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[2].condition_type,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[1].conditions[2].value,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].id,
                        "09cf0415-57ec-4efb-a33e-a7da68faaba6"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].title,
                        "Введите площадь объекта"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].description, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].order, 2);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].answer_type, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].puzzles.length, 1);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].puzzles[0].id,
                        "f6ad1dd8-8c56-46bd-833d-a8325beb0e0a"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].puzzles[0].title, null);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[2].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].puzzles[0].puzzle_type,
                        "input_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[2].puzzles[0].answer_type,
                        "number"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].id,
                        "b0828257-4687-45de-8863-1aff3d1d0b50"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].title,
                        "Введите площадь торгового зала"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].description, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].order, 3);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].puzzle_type,
                        "question"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].answer_type, null);
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].puzzles.length, 1);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].puzzles[0].id,
                        "f1c77dcd-95a1-4cea-982f-ba3269365b2d"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].puzzles[0].title, null);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].puzzles[0].description,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].puzzles[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].puzzles[0].puzzle_type,
                        "input_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].puzzles[0].answer_type,
                        "number"
                    );
                    assert.equal(template.sections[0].puzzles[1].puzzles[3].validations.length, 2);
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].order,
                        0
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].left_hand_puzzle,
                        "09cf0415-57ec-4efb-a33e-a7da68faaba6"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].right_hand_puzzle,
                        "b0828257-4687-45de-8863-1aff3d1d0b50"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].operator_type,
                        "more"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].validation_type,
                        "compare_with_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].value,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[0].error_message,
                        "Ошибка! Площадь объекта не может быть больше площади торгового зала"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].order,
                        1
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].left_hand_puzzle,
                        "b0828257-4687-45de-8863-1aff3d1d0b50"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].right_hand_puzzle,
                        null
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].operator_type,
                        "less"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].validation_type,
                        "set_value"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].value,
                        100
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].puzzles[3].validations[1].error_message,
                        "Ошибка! Площадь объекта не может быть больше 100м*м"
                    );

                    assert.equal(template.sections[0].puzzles[1].conditions.length, 1);
                    assert.equal(template.sections[0].puzzles[1].conditions[0].order, 0);
                    assert.equal(
                        template.sections[0].puzzles[1].conditions[0].question_puzzle,
                        "19972a9f-c592-4b7f-a64f-7a8034392586"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].conditions[0].answer_puzzle,
                        "cea351b9-53cc-4325-8c22-a8448a451f54"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].conditions[0].action_type,
                        "chosen_answer"
                    );
                    assert.equal(
                        template.sections[0].puzzles[1].conditions[0].condition_type,
                        null
                    );
                    assert.equal(template.sections[0].puzzles[1].conditions[0].value, null);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
