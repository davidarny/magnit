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
        user_id: {
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
            const userId = _.escape(inputs.user_id);
            const region = _.escape(inputs.region);
            const branch = _.escape(inputs.branch);

            let sql = "WHERE 1=1";

            if (userId) {
                sql += ` AND users.id = ${userId}`;
            }
            if (region) {
                sql += ` AND regions.name = '${region}'`;
            }
            if (branch) {
                sql += ` AND branches.name = '${branch}'`;
            }

            const objectData = await sails.getDatastore().sendNativeQuery(`
                SELECT
                    users.id,
                    regions.name AS region,
                    branches.name AS branch,
                    users.name,
                    users.position,
                    (
                        SELECT COUNT(*) FROM tasks
                        WHERE tasks.user_id = users.id AND status='assigned'
                    ) AS assigned_count,
                    (
                        SELECT COUNT(*) FROM tasks
                        WHERE tasks.user_id = users.id AND status='completed'
                    ) AS completed_count
                FROM users
                INNER JOIN branches ON users.branch_id = branches.id
                INNER JOIN regions ON branches.region_id = regions.id
                ${sql}
                ORDER BY users.name ${sort} LIMIT ${limit} OFFSET ${offset}
            `);

            const countData = await sails.getDatastore().sendNativeQuery(`
                SELECT COUNT(*) FROM users
                INNER JOIN branches ON users.branch_id = branches.id
                INNER JOIN regions ON branches.region_id = regions.id
                ${sql}
            `);

            const users = objectData.rows;
            const total = Number(countData.rows[0].count);

            return exits.success({ success: 1, total: total, users: users });
        } catch (err) {
            console.log(err);
            return exits.serverError();
        }
    },
};
