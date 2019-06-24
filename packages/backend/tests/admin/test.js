"use strict";

let options = {
    host: JSON.parse(require("fs").readFileSync("config.json"), "utf8").host,
    assert: require("assert"),
    request: require("request"),
};

describe("Admin", () => {
    before(async () => {
        if (process.env.NODE_ENV !== "development") {
            throw new Error("Not development environment! Aborting!");
        }

        const config = JSON.parse(require("fs").readFileSync("config.json"), "utf8");

        const postgresDb = config.postgresql_db;

        const exec = require("child_process").execSync;

        exec(`sudo -u postgres psql --quiet ${postgresDb} < stuff/magnit.sql`);
    });

    require("./parts/create-template.js")(options);
    require("./parts/get-template.js")(options);
    require("./parts/get-templates.js")(options);
    require("./parts/edit-template.js")(options);
    require("./parts/delete-template.js")(options);
    require("./parts/get-objects.js")(options);
});
