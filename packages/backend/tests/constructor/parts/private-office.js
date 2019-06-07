"use strict";

module.exports = function(options) {
    const moment = require("moment");
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#private-office", () => {
        let token;

        before(async () => {
            await Offer.create({
                title: "Oil discount",
                description: "Buy this week and get 20% discount",
                vin: "vin",
                apply_at: new Date(Date.now() - 604800000),
                till_date: new Date(Date.now() + 604800000),
            });
            await Offer.create({
                title: "Spark plug discount text text text text text text text text text",
                description: "Buy oil this week and get 50% discount for spark plug",
                vin: "vin",
                apply_at: new Date(Date.now() - 604800000),
                till_date: new Date(Date.now() + 604800000),
            });
            await Offer.create({
                title: "title",
                description: "description",
                vin: "vin",
                apply_at: new Date(Date.now() + 604800000),
                till_date: new Date(Date.now() + 604800000 + 604800000),
            });
            await UserOffer.create({ user_id: 1, offer_id: 1 });
            await UserOffer.create({ user_id: 1, offer_id: 2 });
            await UserOffer.create({ user_id: 1, offer_id: 3 });
            await UserOffer.create({ user_id: 2, offer_id: 1 });

            let tokenFromDb = await Token.findOne({ id: 9 });

            token = tokenFromDb.token;
        });

        it("should not show offers (user_id and token.user_id does not match)", done => {
            request.get(
                `${host}/v1/users/34/offers`,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 10 });
                        token = refreshedToken.token;

                        assert.equal(httpResponse.statusCode, 403);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Action is not permitted for the user");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should show offers", done => {
            request.get(
                `${host}/v1/users/1/offers`,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 11 });
                        token = refreshedToken.token;

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "");
                        assert.equal(body.offers.length, 2);
                        assert.equal(body.offers[0].offer_id, 1);
                        assert.equal(body.offers[0].status, null);
                        assert.equal(body.offers[0].title, "Oil discount");
                        assert.equal(
                            body.offers[0].description,
                            "Buy this week and get 20% discount"
                        );
                        assert.equal(body.offers[1].offer_id, 2);
                        assert.equal(body.offers[1].status, null);
                        assert.equal(
                            body.offers[1].title,
                            "Spark plug discount text text text text text text text text text"
                        );
                        assert.equal(
                            body.offers[1].description,
                            "Buy oil this week and get 50% discount for spark plug"
                        );

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should log out", done => {
            request.post(
                `${host}/v1/logout`,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let tokens = await Token.find();

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Logged out");
                        assert.equal(tokens.length, 0);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("wrong token", done => {
            request.put(
                `${host}/v1/users/1/profile`,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        assert.equal(httpResponse.statusCode, 401);
                        assert.equal(body.success, 0);
                        assert.equal(body.message, "Wrong token");

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

                        token = body.token;

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should edit user profile", done => {
            request.put(
                `${host}/v1/users/1/profile`,
                {
                    form: {
                        first_name: "Ivan",
                        last_name: "Ivanov",
                        birthdate: "1993-01-31",
                        gender: "male",
                        email: "ivan@ivanov.com",
                        vin: "12345678901234567",
                        car_brand: "Lada",
                        car_model: "Vesta",
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 14 });
                        token = refreshedToken.token;

                        let user = await User.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Profile edited");
                        assert.equal(user.first_name, "Ivan");
                        assert.equal(user.last_name, "Ivanov");
                        assert.equal(user.patronymic, null);
                        assert.equal(moment(user.birthdate).format("YYYY-MM-DD"), "1993-01-31");
                        assert.equal(user.gender, "male");
                        assert.equal(user.email, "ivan@ivanov.com");
                        assert.equal(user.vin, "12345678901234567");
                        assert.equal(user.car_brand, "Lada");
                        assert.equal(user.car_model, "Vesta");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should return user profile", done => {
            request.get(
                `${host}/v1/users/1/profile`,
                {
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 15 });
                        token = refreshedToken.token;

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "");
                        assert.equal(body.profile.first_name, "Ivan");
                        assert.equal(body.profile.last_name, "Ivanov");
                        assert.equal(body.profile.patronymic, null);
                        assert.equal(body.profile.birthdate, "1993-01-31");
                        assert.equal(body.profile.gender, "male");
                        assert.equal(body.profile.email, "ivan@ivanov.com");
                        assert.equal(body.profile.vin, "12345678901234567");
                        assert.equal(body.profile.car_brand, "Lada");
                        assert.equal(body.profile.car_model, "Vesta");

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should increment offer view count (1)", done => {
            request.post(
                `${host}/v1/users/1/offers/2/view`,
                {
                    form: {},
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 16 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "View added");
                        assert.equal(userOffer.status, null);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, null);
                        assert.equal(userOffer.reject_count, null);
                        assert.equal(userOffer.view_count, 1);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should increment offer view count (2)", done => {
            request.post(
                `${host}/v1/users/1/offers/2/view`,
                {
                    form: {},
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 17 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "View added");
                        assert.equal(userOffer.status, null);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, null);
                        assert.equal(userOffer.reject_count, null);
                        assert.equal(userOffer.view_count, 2);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should apply offer", done => {
            request.put(
                `${host}/v1/users/1/offers/1`,
                {
                    form: {
                        status: 1,
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 18 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 1 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Offer applied");
                        assert.equal(userOffer.status, 1);
                        assert.equal(userOffer.postpone_count, null);
                        assert.equal(userOffer.view_count, null);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should postpone offer (1)", done => {
            request.put(
                `${host}/v1/users/1/offers/2`,
                {
                    form: {
                        status: 2,
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 19 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Offer postponed");
                        assert.equal(userOffer.status, 2);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, 1);
                        assert.equal(userOffer.reject_count, null);
                        assert.equal(userOffer.view_count, 2);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should postpone offer (2)", done => {
            request.put(
                `${host}/v1/users/1/offers/2`,
                {
                    form: {
                        status: 2,
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 20 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Offer postponed");
                        assert.equal(userOffer.status, 2);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, 2);
                        assert.equal(userOffer.reject_count, null);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should reject offer (1)", done => {
            request.put(
                `${host}/v1/users/1/offers/2`,
                {
                    form: {
                        status: 3,
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);
                        const refreshedToken = await Token.findOne({ id: 21 });
                        token = refreshedToken.token;

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Offer rejected");
                        assert.equal(userOffer.status, 3);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, 2);
                        assert.equal(userOffer.reject_count, 1);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });

        it("should reject offer (2)", done => {
            request.put(
                `${host}/v1/users/1/offers/2`,
                {
                    form: {
                        status: 3,
                    },
                    headers: {
                        "x-auth-token": token,
                    },
                },
                async (err, httpResponse, body) => {
                    try {
                        if (err) {
                            throw err;
                        }

                        body = JSON.parse(body);

                        let userOffer = await UserOffer.findOne({ id: 2 });

                        assert.equal(httpResponse.statusCode, 200);
                        assert.equal(body.success, 1);
                        assert.equal(body.message, "Offer rejected");
                        assert.equal(userOffer.status, 3);
                        assert.equal(userOffer.apply_at, null);
                        assert.equal(userOffer.postpone_count, 2);
                        assert.equal(userOffer.reject_count, 2);

                        return done();
                    } catch (err) {
                        return done(err);
                    }
                }
            );
        });
    });
};
