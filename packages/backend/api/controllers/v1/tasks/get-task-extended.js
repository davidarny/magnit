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
            const request = require("request");
            const fs = require("fs");
            const config = JSON.parse(fs.readFileSync("config.json"), "UTF-8");
            const taskId = _.escape(inputs.id);

            const task = await Task.findOne({ id: taskId });

            if (!task) {
                return exits.notFound({ success: 0, message: "Task does not exist" });
            }

            const tasksWithTemplates = await TaskTemplate.find({ task_id: taskId });

            if (!_.isEmpty(tasksWithTemplates)) {
                task.templates = await Promise.all(
                    tasksWithTemplates.map(async document => {
                        try {
                            const template = await new Promise((resolve, reject) => {
                                const host = config.host;
                                const options = {
                                    uri: `${host}/v1/templates/${document.template_id}`,
                                    method: "GET",
                                };
                                request(options, async (err, response, body) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    const template = JSON.parse(JSON.parse(body).template);
                                    resolve(template);
                                });
                            });
                            return template;
                        } catch (err) {
                            console.log(err);
                            return undefined;
                        }
                    })
                );
                task.templates = task.templates.filter(Boolean);
                task.estimates = task.templates.map(template => ({
                    id: template.id,
                    template_id: template.id,
                    title: template.title,
                    // TODO: hardcoded data
                    unit: "м3",
                    count: _.random(0, 10000),
                    cost: _.random(0, 1000000),
                }));
            }

            return exits.success({ success: 1, task });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
