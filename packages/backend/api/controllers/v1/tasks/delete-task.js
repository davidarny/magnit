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
        forbidden: {
            statusCode: 403,
        },
        notFound: {
            statusCode: 404,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            const taskId = _.escape(inputs.id);

            const task = await Task.findOne({ id: taskId });

            if (!task) {
                return exits.notFound({ success: 0, message: "Task does not exist" });
            }

            const taskTemplatesCount = await TaskTemplate.find({ task_id: task.id });

            if (taskTemplatesCount.length > 0) {
                return exits.forbidden({
                    success: 0,
                    message: "Cannot delete Task with assigned Templates ",
                });
            }

            await Task.destroy({ id: task.id });

            return exits.success({ success: 1 });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
