const { logger } = require("./logger");

// BASE LOGGER
const BASE_LOGGER = {
  name: 'main',
  hideFromConsole: false
}

module.exports = async ({ dio }) => {
  const DEBUG = dio.f.willShowMainLogger(__filename);

  // GET CONFIG FROM dio
  const config = dio.c.main;

  // LOGGERS CONFIG
  let loggersConfig = config.logging.loggers || [];

  // ADD BASE LOGGER TO CONFIG
  loggersConfig = [BASE_LOGGER].concat(loggersConfig);

  // CREATE LOGGERS
  loggersConfig.forEach(l => {

    // DESTRUCTURE CONFIG
    let { name } = l;

    // CREATE LOGGER
    dio.l[name] = logger(l);
    DEBUG && dio.l.main.info(`${name} logger created...`)

  });

  return DEBUG && dio.l.main.info("Loggers attached...");

}
