"use strict";

let options = {
    host: JSON.parse(require("fs").readFileSync("config.json"), "utf8").host,
    assert: require("assert"),
    request: require("request"),
};

describe("Constructor", () => {
    before(async () => {
        if (process.env.NODE_ENV !== "development") {
            throw new Error("Not development environment! Aborting!");
        }

        const config = JSON.parse(require("fs").readFileSync("config.json"), "utf8");

        const postgresDb = config.postgresql_db;

        const exec = require("child_process").execSync;

        exec(`sudo -u postgres psql --quiet ${postgresDb} < stuff/magnit.sql`);
    });

    require("./parts/construct.js")(options);
});
