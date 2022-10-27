const chaiHttp = require("chai-http");
const chai = require("chai");

chai.use(chaiHttp);

module.exports = ({ dio }) => {
  try {


    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return () => {};

    return function() {

      describe("routers", require("./routers")({ dio }));

    };

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
