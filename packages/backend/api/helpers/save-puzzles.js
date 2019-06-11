module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        puzzles: {
            type: "ref",
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
        const sectionId = inputs.section_id;
        const puzzleId = inputs.puzzle_id;

        for (let i = 0; i < puzzles.length; i++) {
            let puzzle = puzzles[i];

            let newPuzzle = await Puzzle.create({
                title: puzzle.title,
                puzzle_type: puzzle.puzzle_type,
                order: puzzle.order,
                answer_type: puzzle.answer_type,
                parent_id: puzzleId,
            }).fetch();

            await SectionPuzzle.create({
                section_id: sectionId,
                puzzle_id: newPuzzle.id,
            });

            if (puzzle.puzzles) {
                await sails.helpers.savePuzzles(puzzle.puzzles, sectionId, newPuzzle.id);
            }
        }
    },
};
