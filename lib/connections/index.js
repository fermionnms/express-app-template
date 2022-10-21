module.exports = async ({ dio }) => {

  const DEBUG = dio.f.willShowMainLogger(__filename);

  try {

    //===============================================================
    //attach all connections here
    await require("./mongodb")({ dio });

    //===============================================================
    //done
    return DEBUG && dio.l.main.info("All connections attached...")

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }

}
