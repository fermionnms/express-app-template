module.exports = async ({ dio }) => {
  try {


    let RUN_TEST = dio.f.willRunTestFile(__filename);
    if (!RUN_TEST) return;

    await require("./models")({ dio });
    await require("./controllers")({ dio });
    await require("./functions")({ dio });
    await require("./interfaces")({ dio });

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
