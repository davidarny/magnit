module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        id: {
            type: "number",
            required: true,
        },
        task: {
            type: "json",
            required: true,
        },
    },

    exits: {
        notFound: {
            statusCode: 404,
        },
        forbidden: {
            statusCode: 403,
        },
        badRequest: {
            statusCode: 400,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const taskId = _.escape(inputs.id);
            const task = inputs.task;

            // check if task exists
            {
                const task = await Task.findOne({ id: taskId });

                if (!task) {
                    return exits.notFound({ success: 0, message: "Task does not exist" });
                }
            }

            await Task.updateOne({ id: taskId }).set(task);

            return exits.success({ success: 1 });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
