module.exports = async ({ dio }) => {

  const DEBUG = dio.f.willShowMainLogger(__filename);

  try {

    await require("./example")({ dio });

    //===============================================================
    //done
    return DEBUG && dio.l.main.info("All controllers attached...")

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
