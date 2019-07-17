module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        task: {
            type: "json",
            required: true,
        },
        task_id: {
            type: "number",
        },
        created_at: {
            type: "ref",
        },
    },

    exits: {
        badRequest: {
            statusCode: 400,
        },
        serverError: {
            responseType: "serverError",
        },
    },

    fn: async function(inputs, exits) {
        try {
            let task = inputs.task;
            let taskId = _.escape(inputs.task_id);
            let createdAt = _.escape(inputs.created_at);

            if (typeof task !== "object") {
                return exits.badRequest({ success: 0, message: "Not valid JSON" });
            }

            const payload = {
                objectId: task.object_id,
                userId: task.user_id,
                name: task.name,
                description: task.description,
                departureDate: task.departure_date,
                deadlineDate: task.deadline_date,
                status: task.status,
            };

            if (taskId) {
                payload.id = taskId;
            }

            if (createdAt) {
                payload.createdAt = createdAt;
            }

            const taskDocument = await Task.create(payload).fetch();

            return exits.success({ success: 1, task_id: taskDocument.id });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
