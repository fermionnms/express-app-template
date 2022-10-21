module.exports = async ({ dio }) => {

  const DEBUG = dio.f.willShowMainLogger(__filename);
  const MIDDLEWARE_NAME = "auth";
  const config = dio.c.main;

  try {

    // CHECK IF DUPLICATE NAME
    if (!!dio.interfaces.http.middleware[MIDDLEWARE_NAME]) throw new Error(`There already is a middleware group with the name '${MIDDLEWARE_NAME}'`);

    let m = {};

    // checks that the requesting service is a valid service registered with this app in the config
    m.parseRequestingService = (req, res, next) => {
      if (config.node_env === "test") {
        req.requestingService = {
          name: "test"
        };
        return next();
      }
      let apikey = req.headers[config.security.serviceAPIKeyHeaderName];
      if (!apikey) {
        return res.status(401).send({
          success: false,
          err: {
            message: `Cannot access app resources without required apikey header`
          },
          httpStatusCode: 401
        })
      }
      let requestingService = dio.f.getServiceWithAPIKey(apikey);
      if (!requestingService) {
        return res.status(401).send({
          success: false,
          err: {
            message: `Invalid apikey header`
          },
          httpStatusCode: 401
        })
      }
      req.requestingService = requestingService;
      return next();
    }

    dio.interfaces.http.middleware[MIDDLEWARE_NAME] = m;
    return DEBUG && dio.l.main.info(`${MIDDLEWARE_NAME} middleware attached...`);

  }

  catch (err) {
    !dio.isRunningTests && dio.l.main.error(`Error when attaching the ${MIDDLEWARE_NAME} middleware!`);
    DEBUG && !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
