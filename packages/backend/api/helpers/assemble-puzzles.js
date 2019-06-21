module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        puzzles: {
            type: "ref",
        },
    },

    fn: async function(inputs, exits) {
        let puzzles = [];

        for (let i = 0; i < inputs.puzzles.length; i++) {
            let puzzle = inputs.puzzles[i];

            puzzles.push({
                title: puzzle.title,
                description: puzzle.description,
                order: puzzle.order,
                puzzle_type: puzzle.puzzle_type,
                answer_type: puzzle.answer_type,
                id: puzzle.uuid,
            });

            let conditions = await Condition.find({ puzzle_id: puzzle.id }).sort("order ASC");
            if (conditions.length > 0) {
                puzzles[i].conditions = [];
                for (let j = 0; j < conditions.length; j++) {
                    let condition = conditions[j];
                    puzzles[i].conditions.push({
                        order: condition.order,
                        question_puzzle: condition.question_puzzle,
                        answer_puzzle: condition.answer_puzzle,
                        action_type: condition.action_type,
                        condition_type: condition.condition_type,
                        value: condition.value,
                    });
                }
            }

            let validations = await Validation.find({ puzzle_id: puzzle.id }).sort("order ASC");
            if (validations.length > 0) {
                puzzles[i].validations = [];
                for (let j = 0; j < validations.length; j++) {
                    let validation = validations[j];
                    puzzles[i].validations.push({
                        order: validation.order,
                        left_hand_puzzle: validation.left_hand_puzzle,
                        operator_type: validation.operator_type,
                        validation_type: validation.validation_type,
                        right_hand_puzzle: validation.right_hand_puzzle,
                        value: validation.value,
                        error_message: validation.error_message,
                    });
                }
            }

            const items = await Puzzle.find({ parent_id: puzzle.id }).sort("order ASC");

            if (items.length > 0) {
                puzzles[i].puzzles = [];
                puzzles[i].puzzles = await sails.helpers.assemblePuzzles(items);
            }
        }

        return exits.success(puzzles);
    },
};
