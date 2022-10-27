const _ = require("lodash");
const assert = require("chai").assert;

module.exports = async ({ dio }) => {
  try {

    const config = dio.c.main;
    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return;

    describe("functions", function() {

      //===============================================================
      describe("checkStringIsUUID", function() {


        it("returns false if not uuid", function(done) {
          let fakeUuid = "hjgdfsgfds";
          assert(
            dio.f.checkStringIsUUID(fakeUuid) === false,
            `result should be false`
          );
          done();
        });

        it("returns true if uuid", function(done) {
          let realUuid = dio.f.generateDeterministicUUID();
          assert(
            dio.f.checkStringIsUUID(realUuid) === true,
            `result should be true`
          );
          done();
        });

      });

      //===============================================================
      describe("getServiceWithAPIKey", function() {

        it("returns a valid service with valid apikey", function(done) {
          let service = config.security.serviceAPIKeys[0];
          let res = dio.f.getServiceWithAPIKey(service?.apikey);
          assert(
            res.apikey === service.apikey,
            `result apikey should be service apikey`
          );
          assert(
            res.name === service.name,
            `result name should be service name`
          );
          done();
        });

      });

      describe("generateDeterministicUUID", function() {

        let x;
        before(function() {
          x = dio.f.generateDeterministicUUID();
        });

        it("result is uuid", function(done) {
          assert(
            dio.f.checkStringIsUUID(x),
            `${x} is not a uuid`
          );
          done();
        });

      });

      //===============================================================
      describe("generateRandomUUIDWithNamespace", function() {

        let x;
        before(function() {
          x = dio.f.generateRandomUUIDWithNamespace();
        });

        it("result is uuid", function(done) {
          assert(
            dio.f.checkStringIsUUID(x),
            `${x} is not a uuid`
          );
          done();
        });

      });

      //===============================================================
      describe("handleHttpRequestForController", function() {

        it("returns error if no ctlFunction specified", async function() {
          let x = await dio.f.handleHttpRequestForController();
          assert(x?.success === false, `${x?.success} should be false`);
          assert(x?.err?.message === "Error: ctlFunction not found", `'${x?.err?.message}' is not the right fail message`);
          assert(x?.httpStatusCode === 500, `${x?.httpStatusCode} should be 500`);
        });

        it("exampleFunc returns expected result", async function() {
          let ctlParams = "testing handleHttpRequestForController";
          let x = await dio.f.handleHttpRequestForController({
            ctlFunction: dio.controllers.example.exampleFunc,
            ctlParams
          });
          assert(x?.success === true, `${x?.success} should be true`);
          assert(!x?.err, `${x?.err} Should be undefined`);
          assert(x?.httpStatusCode === 200, `${x?.httpStatusCode} should be 200`);
          assert(x?.payload === ctlParams, `${x?.payload} should be ${ctlParams}`);
        })

      });

    })

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
