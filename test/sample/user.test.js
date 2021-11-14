const path = require("path")
const sample = require(path.resolve("modules/sample/routes"));
request = require("supertest");

describe("Sample", () => {
    it("Should have status of 200", done => {
        request(sample).get("/").expect(200, done);
    })
})