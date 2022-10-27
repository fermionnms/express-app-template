module.exports = async ({ dio }) => {
  try {


    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return;

    describe("controllers", async function() {

    });

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
