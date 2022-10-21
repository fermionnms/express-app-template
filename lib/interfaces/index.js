module.exports = async ({ dio }) => {

  const config = dio.c.main;
  const DEBUG = dio.f.willShowMainLogger(__filename);

  try {

    //===============================================================
    // attach interfaces
    await require("./http")({ dio });

    //===============================================================
    //done
    return DEBUG && dio.l.main.info("All interfaces attached...")

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
