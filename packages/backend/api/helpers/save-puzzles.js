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
                for (let i = 0; i < puzzle.conditions.length; i++) {
                    let condition = puzzle.conditions[i];

                    await Condition.create({
                        puzzle_id: newPuzzle.id,
                        order: condition.order,
                        action_type: condition.action_type,
                        condition_type: condition.condition_type,
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
