module.exports = {
    friendlyName: "",

    description: "",

    inputs: {
        offset: {
            type: "number",
            defaultsTo: 0,
        },
        limit: {
            type: "number",
            defaultsTo: 10,
        },
        sort: {
            type: "string",
            isIn: ["ASC", "DESC"],
            defaultsTo: "ASC",
        },
        name: {
            type: "string",
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
            const offset = _.escape(inputs.offset);
            const limit = _.escape(inputs.limit);
            const sort = _.escape(inputs.sort);
            const name = _.escape(inputs.name);

            const criteria = {};

            if (name) {
                criteria.title = name;
            }

            const total = await Task.count(criteria);
            const tasks = await Task.find(criteria)
                .skip(offset)
                .limit(limit)
                .sort([{ name: sort }]);

            return exits.success({ success: 1, total, tasks });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
