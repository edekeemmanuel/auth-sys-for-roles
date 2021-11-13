const path = require("path")
const sample = require(path.resolve("modules/sample/routes.js"));
const request = require("supertest");
const { expect } = require("chai");
describe("Sample test", () => {
    it("Should have status of 200", done => {
        request(sample).get("/").then(response => {
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an("object");
            done();
        }).catch(err => {
            console.log(err);
            // done(err);
        });
    })
})