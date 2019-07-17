module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        id: {
            type: "number",
            required: true,
        },
    },

    exits: {
        notFound: {
            statusCode: 404,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const id = _.escape(inputs.id);

            const task = await Task.findOne({ id });

            if (!task) {
                return exits.notFound({ success: 0, message: "Task does not exist" });
            }

            return exits.success({ success: 1, task });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
