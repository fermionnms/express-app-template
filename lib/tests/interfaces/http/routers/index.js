module.exports = ({ dio }) => {
  try {


    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return () => {};

    return function() {

      describe("test", require("./test")({ dio }));

    };

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
