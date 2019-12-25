module.exports = {
    hostname: process.env.RABBITMQ_HOST || "localhost",
    port: process.env.RABBITMQ_PORT || 5672,
    username: process.env.RABBITMQ_USER || "magnit",
    password: process.env.RABBITMQ_PASSWORD || "magnit",
};
