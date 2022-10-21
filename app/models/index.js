module.exports = async ({ dio }) => {

  const DEBUG = dio.f.willShowMainLogger(__filename);

  try {

    //===============================================================
    //attach models

    //===============================================================
    //done
    return DEBUG && dio.l.main.info("All models attached...");

  }

  catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
