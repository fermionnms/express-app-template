const _ = require("lodash");


module.exports = async ({ dio }) => {
  const config = dio.c.main;
  const DEBUG = dio.f.willShowMainLogger(__filename);
  const controller_name = "example";

  try {
    let ctl = {};

    //===============================================================
    //exampleFunc
    ctl.exampleFunc = async (opts) => {
      try {

        return {
          success: true,
          payload: opts
        };
      }

      catch (err) {
        !dio.isRunningTests && dio.l.main.error(err.toString());
        return {
          success: false,
          err: {
            error: err,
            message: err.toString()
          }
        };
      }
    };

    //===============================================================
    //done
    dio.controllers[controller_name] = ctl;
    return DEBUG && dio.l.main.info(`${controller_name} controller attached...`);
  } catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
};
