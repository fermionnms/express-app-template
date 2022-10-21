const express = require("express");
const bodyParser = require("body-parser");

module.exports = async ({ dio }) => {
  const DEBUG = dio.f.willShowMainLogger(__filename);

  // CONFIG
  const config = dio.c.main;
  let PORT = `${dio.isRunningTests ? "1" : ""}${config.interfaces.http.port}`;

  // EXPRESS
  const instance = express();

  // ATTACH MIDDLEWARE FUNCTIONS
  await require("./middleware")({ dio });

  // MIDDLEWARE
  instance.use(bodyParser.json());
  instance.use(dio.interfaces.http.middleware.auth.parseRequestingService);

  // don't remove this middleware. Is useful for debugging
  DEBUG && instance.use((req, res, next) => {
    dio.l.main.info("HTTP interface triggered...");
    next();
  });

  // ROUTERS
  await require("./routers")({ dio });

  // OPEN ROUTES
  Object.entries(dio.interfaces.http.routers).forEach(r => {
    instance.use(`${config.interfaces.http.routerPrefix}${r[0]}`, r[1]);
  })

  // SERVER INSTANCE
  dio.interfaces.http.instance = instance.listen(
    PORT,
    () => DEBUG && dio.l.main.info(`HTTP server now listening on port ${PORT}...`)
  );

  return DEBUG && dio.l.main.info("HTTP interface attached...");
}
