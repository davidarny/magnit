module.exports = {
    type: "postgres",
    host: process.env.POSTGRES_HOST || "localhost",
    port: Number(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || "magnit",
    password: process.env.POSTGRES_PASSWORD || "magnit",
    database: process.env.POSTGRES_DB || "magnit",
    logger: "advanced-console", // custom file logger in production
    logging: process.env.NODE_ENV !== "testing",
    synchronize: true,
};
