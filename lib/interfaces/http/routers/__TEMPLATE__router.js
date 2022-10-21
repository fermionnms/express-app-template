module.exports = async ({ dio }) => {

  const DEBUG = dio.f.willShowMainLogger(__filename);
  const ROUTER_NAME = "template";
  const router = require("express").Router();

  try {

    // CHECK IF DUPLICATE NAME
    if (!!dio.interfaces.http.routers[ROUTER_NAME]) throw new Error(`There already is a router with the name '${ROUTER_NAME}'`);

    // MIDDLEWARE

    // don't remove this middleware. Is useful for debugging
    DEBUG && router.use((req, res, next) => {
      dio.l.main.info(`${ROUTER_NAME} router triggered...`);
      next();
    });

    // END MIDDLEWARE

    // GET

    router.get("/", async (req, res) => {

      // do pre-controller setup here

      let result = await dio.f.handleHttpRequestForController({
        ctlParams: {hi: "there"},
        ctlFunction: dio.controllers.exampleController.exampleFunction,
        isRouterDebug: DEBUG,
        routerName: ROUTER_NAME,
        initialResult: null
      });

      res.status(result.httpStatusCode).send(result);
    });

    // END GET

    // POST

    // END POST

    dio.interfaces.http.routers[ROUTER_NAME] = router;
    return DEBUG && dio.l.main.info(`${ROUTER_NAME} http router attached...`);

  }

  catch (err) {
    !dio.isRunningTests && dio.l.main.error(`Error when attaching the ${ROUTER_NAME} router!`);
    DEBUG && !dio.isRunningTests && dio.l.main.error(err.toString());
  }
}
