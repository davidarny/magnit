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
            }

            await Subject.create({
                name: `object 1000`,
                branch_id: 1,
                address: `address 1000`,
                format: `МК`,
            });

            await Task.create({
                object_id: 1,
                status: "completed",
                departure_date: new Date(),
                deadline_date: new Date(Date.now() + 604800000),
                name: "task 1",
                description: "task description 1",
            });

            await Task.create({
                object_id: 1,
                status: "completed",
                departure_date: new Date(),
                deadline_date: new Date(Date.now() + 604800000),
                name: "task 2",
                description: "task description 2",
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
                    assert.equal(body.objects[0].assigned_count, 0);
                    assert.equal(body.objects[0].completed_count, 2);
                    assert.equal(body.objects[9].region, "region 12");
                    assert.equal(body.objects[9].assigned_count, 0);
                    assert.equal(body.objects[9].completed_count, 0);

                    return done();
                } catch (err) {
                    return done(err);
                }
            });
        });
    });
};
