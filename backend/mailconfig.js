module.exports = {
    transport: {
        host: process.env.SMTP_HOST || "smtp.mailtrap.io",
        port: process.env.SMTP_PORT || 2525,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    },
    defaults: {
        from: process.env.SMTP_FROM || '"Магнит" <magnit@mail.com>',
    },
};
