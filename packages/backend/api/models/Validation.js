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
            allowNull: true,
        },

        validation_type: {
            type: "string",
            allowNull: true,
        },

        left_hand_puzzle: {
            type: "string",
            isUUID: true,
            allowNull: true,
        },

        right_hand_puzzle: {
            type: "string",
            isUUID: true,
            allowNull: true,
        },

        value: {
            type: "ref",
        },

        error_message: {
            type: "string",
            columnType: "text",
        },
    },
};
