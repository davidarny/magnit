module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        puzzles: {
            type: "ref",
        },
        template_id: {
            type: "number",
        },
        section_id: {
            type: "number",
            allowNull: true,
        },
        puzzle_id: {
            type: "number",
            allowNull: true,
        },
    },

    fn: async function(inputs) {
        const puzzles = inputs.puzzles;
        const templateId = inputs.template_id;
        const sectionId = inputs.section_id;
        const puzzleId = inputs.puzzle_id;

        for (let i = 0; i < puzzles.length; i++) {
            let puzzle = puzzles[i];

            let newPuzzle = await Puzzle.create({
                uuid: puzzle.id,
                title: puzzle.title,
                description: puzzle.description,
                puzzle_type: puzzle.puzzle_type,
                order: puzzle.order,
                answer_type: puzzle.answer_type,
                parent_id: puzzleId,
                template_id: templateId,
                section_id: sectionId,
            }).fetch();

            if (puzzle.conditions) {
                for (let j = 0; j < puzzle.conditions.length; j++) {
                    let condition = puzzle.conditions[j];

                    await Condition.create({
                        puzzle_id: newPuzzle.id,
                        order: condition.order,
                        action_type: condition.action_type,
                        condition_type: condition.condition_type,
                        question_puzzle: condition.question_puzzle,
                        answer_puzzle: condition.answer_puzzle,
                        value: condition.value,
                    });
                }
            }

            if (puzzle.validations) {
                for (let j = 0; j < puzzle.validations.length; j++) {
                    let validation = puzzle.validations[j];

                    await Validation.create({
                        puzzle_id: newPuzzle.id,
                        order: validation.order,
                        operator_type: validation.operator_type,
                        validation_type: validation.validation_type,
                        left_hand_puzzle: validation.left_hand_puzzle,
                        right_hand_puzzle: validation.right_hand_puzzle,
                        value: validation.value,
                        error_message: validation.error_message,
                    });
                }
            }

            if (puzzle.puzzles) {
                await sails.helpers.savePuzzles(
                    puzzle.puzzles,
                    templateId,
                    sectionId,
                    newPuzzle.id
                );
            }
        }
    },
};
