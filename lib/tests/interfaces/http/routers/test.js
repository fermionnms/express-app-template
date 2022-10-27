const _ = require("lodash");
const chai = require("chai");
const assert = require("chai").assert;

module.exports = ({ dio }) => {
  try {
    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return () => {};

    return function () {
      const apiPrefix = `${dio.c.main.interfaces.http.routerPrefix}test`;

      // GET

      //===============================================================
      describe("GET /", function () {
        it("should return successful response always", async function () {
          let res = await chai
            // .request("http://localhost:11234")
            .request(dio.interfaces.http.instance)
            .get(`${apiPrefix}/`);
          let body = res.body;
          assert(res.status === 200, "res.status is not 200");
          assert(
            body.httpStatusCode === 200,
            "res.body.httpStatusCode is not 200"
          );
          assert(body.success === true, "res.body.success is not true");
          assert(
            body.message === "This is a test of the http interface",
            "unexpected res.body.message"
          );
        });
      });

      // END GET

      // POST

      //===============================================================
      describe("POST /", function () {
        it("should return successful response with payload.body equal to request body", async function () {
          let reqBody = {
            hello: "world",
          };
          let res = await chai
            .request(dio.interfaces.http.instance)
            .post(`${apiPrefix}/`)
            .send(reqBody);
          let body = res.body;
          assert(res.status === 200, "res.status is not 200");
          assert(
            body.httpStatusCode === 200,
            "res.body.httpStatusCode is not 200"
          );
          assert(body.success === true, "res.body.success is not true");
          assert(
            body.payload.heading === "This is a test post request",
            "unexpected res.body.payload.heading"
          );
          assert(
            JSON.stringify(body.payload.body) === JSON.stringify(reqBody),
            "unexpected res.body.payload.body"
          );
        });
      });

      // END POST
    };
  } catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
};
