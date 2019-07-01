"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#get-users", () => {
        let options = {
            uri: `${host}/v1/users`,
            method: "GET",
        };

        it("get first 10 users (asc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 34);
                    assert.equal(body.users.length, 10);
                    assert.equal(body.users[0].region, "region 0");
                    assert.equal(body.users[0].branch, "branch 0");
                    assert.equal(body.users[0].name, "Ivanon Ivan Ivanovich 0");
                    assert.equal(body.users[0].position, "foreman");
                    assert.equal(body.users[0].assigned_count, 1);
                    assert.equal(body.users[0].completed_count, 1);
                    assert.equal(body.users[3].region, "region 0");
                    assert.equal(body.users[3].branch, "branch 100");
                    assert.equal(body.users[3].name, "Ivanon Ivan Ivanovich 100");
                    assert.equal(body.users[3].position, "foreman");
                    assert.equal(body.users[3].assigned_count, 0);
                    assert.equal(body.users[3].completed_count, 1);
                    assert.equal(body.users[9].region, "region 6");
                    assert.equal(body.users[9].branch, "branch 106");
                    assert.equal(body.users[9].name, "Ivanon Ivan Ivanovich 106");
                    assert.equal(body.users[9].position, "foreman");
                    assert.equal(body.users[9].assigned_count, 0);
                    assert.equal(body.users[9].completed_count, 0);

                    options.uri = `${host}/v1/users?offset=7&limit=10&sort=DESC`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get users from 8 to 18 (desc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 34);
                    assert.equal(body.users.length, 10);
                    assert.equal(body.users[0].region, "region 2");
                    assert.equal(body.users[0].branch, "branch 2");
                    assert.equal(body.users[0].name, "Ivanon Ivan Ivanovich 2");
                    assert.equal(body.users[0].assigned_count, 0);
                    assert.equal(body.users[0].completed_count, 0);
                    assert.equal(body.users[9].region, "region 13");
                    assert.equal(body.users[9].branch, "branch 113");
                    assert.equal(body.users[9].name, "Ivanon Ivan Ivanovich 113");
                    assert.equal(body.users[9].assigned_count, 0);
                    assert.equal(body.users[9].completed_count, 0);

                    options.uri = `${host}/v1/users?region=region%2014`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get users by region name", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 2);
                    assert.equal(body.users.length, 2);
                    assert.equal(body.users[0].region, "region 14");
                    assert.equal(body.users[0].branch, "branch 114");
                    assert.equal(body.users[0].name, "Ivanon Ivan Ivanovich 114");
                    assert.equal(body.users[0].assigned_count, 0);
                    assert.equal(body.users[0].completed_count, 0);
                    assert.equal(body.users[1].region, "region 14");
                    assert.equal(body.users[1].branch, "branch 14");
                    assert.equal(body.users[1].name, "Ivanon Ivan Ivanovich 14");
                    assert.equal(body.users[1].assigned_count, 0);
                    assert.equal(body.users[1].completed_count, 0);

                    options.uri = `${host}/v1/users?region=region%2014&branch=branch%20114`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get users by region and branch name", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 1);
                    assert.equal(body.users.length, 1);
                    assert.equal(body.users[0].region, "region 14");
                    assert.equal(body.users[0].branch, "branch 114");
                    assert.equal(body.users[0].name, "Ivanon Ivan Ivanovich 114");
                    assert.equal(body.users[0].assigned_count, 0);
                    assert.equal(body.users[0].completed_count, 0);

                    options.uri = `${host}/v1/users?user_id=27`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get users by id", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 1);
                    assert.equal(body.users.length, 1);
                    assert.equal(body.users[0].region, "region 13");
                    assert.equal(body.users[0].branch, "branch 13");
                    assert.equal(body.users[0].name, "Ivanon Ivan Ivanovich 13");
                    assert.equal(body.users[0].assigned_count, 0);
                    assert.equal(body.users[0].completed_count, 0);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
