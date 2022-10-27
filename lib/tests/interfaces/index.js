module.exports = ({ dio }) => {
  try {


    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return;

    describe("interfaces", async function() {

      describe("http", require("./http")({ dio }));

    });

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
