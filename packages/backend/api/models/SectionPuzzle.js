module.exports = {
    tableName: "section_puzzles",

    attributes: {
        section_id: {
            type: "number",
        },

        puzzle_id: {
            type: "number",
            allowNull: true,
        },
    },
};
