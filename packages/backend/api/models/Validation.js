module.exports = {
    tableName: "validations",

    attributes: {
        order: {
            type: "number",
        },

        puzzle_id: {
            type: "number",
        },

        operator_type: {
            type: "string",
        },

        validation_type: {
            type: "string",
        },

        left_hand_puzzle: {
            type: "string",
            isUUID: true,
        },

        right_hand_puzzle: {
            type: "string",
            isUUID: true,
            allowNull: true,
        },

        value: {
            type: "number",
            allowNull: true,
        },

        error_message: {
            type: "string",
            columnType: "text",
        },
    },
};
