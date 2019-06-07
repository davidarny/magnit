"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#login", () => {
        it("should not auth (user does not exist)", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995508",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        assert.equal(httpResponse.statusCode, 404);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "User does not exist");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not auth (wrong password (1))", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Wrong password");
                        assert.equal(user.login_attempts, 1);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not auth (wrong password (2))", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Wrong password");
                        assert.equal(user.login_attempts, 2);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not auth (wrong password (3))", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Wrong password");
                        assert.equal(user.login_attempts, 3);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not auth (number of attempts exceeded)", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Try again in a minute");
                        assert.equal(user.login_attempts, 3);

                        await User.update({ id: user.id }).set({
                            last_login_attempt_at: new Date(Date.now() - 100000),
                        });

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not auth (1 min has passed and wrong password)", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "111111",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Wrong password");
                        assert.equal(user.login_attempts, 1);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should auth", done => {
            request.post(
                `${host}/v1/login`,
                {
                    form: {
                        login: "79677995509",
                        password: "qwerty",
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let tokens = await Token.find();
                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Authenticated");
                        assert.equal(tokens.length, 1);
                        assert.equal(tokens[0].token, body.token);
                        assert.equal(user.login_attempts, null);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });
    });
};
