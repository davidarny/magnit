"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#restore-password", () => {
        let token;
        let code;

        it("should resend sms", done => {
            request.post(
                `${host}/v1/resend-sms`,
                {
                    form: {
                        login: "79677995509",
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

                        token = body.token;
                        code = user.code;

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Sms code resent");
                        assert.equal(tokens.length, 1);
                        assert.equal(tokens[0].token, token);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should let user change password", done => {
            request.post(
                `${host}/v1/verify-sms`,
                {
                    form: {
                        code: code,
                    },
                    headers: { "x-auth-token": token },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let tokens = await Token.find();
                        token = body.token;

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.user_id, 1);
                        assert.equal(body.message, "Code entered correctly");
                        assert.equal(tokens.length, 1);
                        assert.equal(tokens[0].user_id, 1);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not change password (trying to change not own password)", done => {
            request.put(
                `${host}/v1/users/2/password`,
                {
                    form: {
                        password: "qwerty",
                    },
                    headers: { "x-auth-token": token },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let refreshedToken = await Token.findOne({ id: 7 });
                        token = refreshedToken.token;

                        assert.equal(httpResponse.statusCode, 403);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "User may change only his own password");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should not change password (wrong token)", done => {
            request.put(
                `${host}/v1/users/1/password`,
                {
                    form: {
                        password: "qwerty",
                    },
                    headers: { "x-auth-token": "wrong.token" },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "jwt malformed");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should change password", done => {
            request.put(
                `${host}/v1/users/1/password`,
                {
                    form: {
                        password: "qwerty",
                    },
                    headers: { "x-auth-token": token },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Password changed");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });
    });
};
