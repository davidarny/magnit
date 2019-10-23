const development = process.env.NODE_ENV === "development";

const pino = require("pino");

export class LoggerFactory {
    private static config = {
        colorize: true,
        translateTime: true,
        levelFirst: true,
    };

    private static instance = null;

    static getLogger() {
        if (this.instance === null) {
            this.instance = pino({
                level: "trace",
                prettyPrint: development && this.config,
            });
        }
        return this.instance;
    }
}
