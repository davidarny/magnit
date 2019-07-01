"use strict";

module.exports = function(options) {
    let request = options.request;
    let host = options.host;
    let assert = options.assert;

    describe("#get-objects", () => {
        let options = {
            uri: `${host}/v1/objects`,
            method: "GET",
        };

        before(async () => {
            for (let i = 0; i < 17; i++) {
                const region = await Region.create({
                    name: `region ${i}`,
                }).fetch();

                const branch1 = await Branch.create({
                    region_id: region.id,
                    name: `branch ${i}`,
                }).fetch();

                const branch2 = await Branch.create({
                    region_id: region.id,
                    name: `branch ${i + 100}`,
                }).fetch();

                await Subject.create({
                    name: `object ${i}`,
                    branch_id: branch1.id,
                    address: `address ${i}`,
                    format: `МК`,
                });

                await Subject.create({
                    name: `object ${i + 100}`,
                    branch_id: branch2.id,
                    address: `address ${i + 100}`,
                    format: `МК`,
                });

                await User.create({
                    branch_id: branch1.id,
                    name: `Ivanon Ivan Ivanovich ${i}`,
                    login: `login ${i}`,
                    position: `foreman`,
                });

                await User.create({
                    branch_id: branch2.id,
                    name: `Ivanon Ivan Ivanovich ${i + 100}`,
                    login: `login ${i + 100}`,
                    position: `foreman`,
                });
            }

            await Subject.create({
                name: `object 1000`,
                branch_id: 1,
                address: `address 1000`,
                format: `МК`,
            });

            await Task.create({
                object_id: 1,
                user_id: 1,
                status: "completed",
                departure_date: new Date(),
                deadline_date: new Date(Date.now() + 604800000),
                name: "task 1",
                description: "task description 1",
            });

            await Task.create({
                object_id: 1,
                user_id: 2,
                status: "completed",
                departure_date: new Date(),
                deadline_date: new Date(Date.now() + 604800000),
                name: "task 2",
                description: "task description 2",
            });

            await Task.create({
                object_id: 1,
                user_id: 1,
                status: "assigned",
                departure_date: new Date(),
                deadline_date: new Date(Date.now() + 604800000),
                name: "task 3",
                description: "task description 3",
            });
        });

        it("get first 10 objects (asc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 35);
                    assert.equal(body.objects.length, 10);
                    assert.equal(body.objects[0].region, "region 0");
                    assert.equal(body.objects[0].assigned_count, 1);
                    assert.equal(body.objects[0].completed_count, 2);
                    assert.equal(body.objects[9].region, "region 12");
                    assert.equal(body.objects[9].assigned_count, 0);
                    assert.equal(body.objects[9].completed_count, 0);

                    options.uri = `${host}/v1/objects?offset=7&limit=10&sort=DESC`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get objects from 8 to 18 (desc)", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 35);
                    assert.equal(body.objects.length, 10);
                    assert.equal(body.objects[0].region, "region 6");
                    assert.equal(body.objects[0].branch, "branch 6");
                    assert.equal(body.objects[0].address, "address 6");
                    assert.equal(body.objects[0].assigned_count, 0);
                    assert.equal(body.objects[0].completed_count, 0);
                    assert.equal(body.objects[9].region, "region 16");
                    assert.equal(body.objects[9].branch, "branch 16");
                    assert.equal(body.objects[9].address, "address 16");
                    assert.equal(body.objects[9].assigned_count, 0);
                    assert.equal(body.objects[9].completed_count, 0);

                    options.uri = `${host}/v1/objects?region=region%2014`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get objects by region name", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 2);
                    assert.equal(body.objects.length, 2);
                    assert.equal(body.objects[0].region, "region 14");
                    assert.equal(body.objects[0].branch, "branch 14");
                    assert.equal(body.objects[0].address, "address 14");
                    assert.equal(body.objects[0].assigned_count, 0);
                    assert.equal(body.objects[0].completed_count, 0);
                    assert.equal(body.objects[1].region, "region 14");
                    assert.equal(body.objects[1].branch, "branch 114");
                    assert.equal(body.objects[1].address, "address 114");
                    assert.equal(body.objects[1].assigned_count, 0);
                    assert.equal(body.objects[1].completed_count, 0);

                    options.uri = `${host}/v1/objects?region=region%2014&branch=branch%20114`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get objects by region and branch name", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 1);
                    assert.equal(body.objects.length, 1);
                    assert.equal(body.objects[0].region, "region 14");
                    assert.equal(body.objects[0].branch, "branch 114");
                    assert.equal(body.objects[0].address, "address 114");
                    assert.equal(body.objects[0].assigned_count, 0);
                    assert.equal(body.objects[0].completed_count, 0);

                    options.uri = `${host}/v1/objects?object_id=19`;

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });

        it("get object by id", done => {
            request(options, async (err, httpResponse, body) => {
                try {
                    if (err) {
                        throw err;
                    }

                    body = JSON.parse(body);

                    assert.equal(body.success, 1);
                    assert.equal(body.total, 1);
                    assert.equal(body.objects.length, 1);
                    assert.equal(body.objects[0].region, "region 9");
                    assert.equal(body.objects[0].branch, "branch 9");
                    assert.equal(body.objects[0].address, "address 9");
                    assert.equal(body.objects[0].assigned_count, 0);
                    assert.equal(body.objects[0].completed_count, 0);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
