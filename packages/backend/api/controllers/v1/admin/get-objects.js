module.exports = {
    friendlyName: "",

    description: ``,

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
        object_id: {
            type: "number",
        },
        region: {
            type: "string",
        },
        branch: {
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
            const objectId = _.escape(inputs.object_id);
            const region = _.escape(inputs.region);
            const branch = _.escape(inputs.branch);

            let sql = "";

            if (objectId || region || branch) {
                sql += "WHERE ";
            }

            if (objectId) {
                sql += `objects.id = ${objectId}`;
            }
            if (region) {
                sql += `regions.name = '${region}'`;
            }
            if (branch) {
                sql += `branches.name = '${branch}'`;
            }

            const objectData = await sails.getDatastore().sendNativeQuery(`
                SELECT
                    objects.id,
                    regions.name AS region,
                    branches.name AS branch,
                    objects.address,
                    objects.format,
                    (
                        SELECT COUNT(*) FROM tasks
                        WHERE tasks.object_id = objects.id AND status='assigned'
                    ) AS assigned_count,
                    (
                        SELECT COUNT(*) FROM tasks
                        WHERE tasks.object_id = objects.id AND status='completed'
                    ) AS completed_count
                FROM objects
                INNER JOIN branches ON objects.branch_id = branches.id
                INNER JOIN regions ON branches.region_id = regions.id
                ${sql}
                ORDER BY regions.name ${sort} LIMIT ${limit} OFFSET ${offset}
            `);

            const countData = await sails.getDatastore().sendNativeQuery(`
                SELECT COUNT(*) FROM objects ${sql}
            `);

            const objects = objectData.rows;
            const total = Number(countData.rows[0].count);

            return exits.success({ success: 1, total: total, objects: objects });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
