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
            const taskId = _.escape(inputs.id);

            const task = await Task.findOne({ id: taskId });

            if (!task) {
                return exits.notFound({ success: 0, message: "Task does not exist" });
            }

            const tasksWithTemplates = await TaskTemplate.find({ task_id: taskId });

            if (tasksWithTemplates.length > 0) {
                task.templates = tasksWithTemplates.map(document => document.template_id);
            }

            return exits.success({ success: 1, task });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
