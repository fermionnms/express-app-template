const path = require("path");
const winston = require("winston");

exports.logger = opts => {

  // DESTRUCTURE OPTS
  let {
    name,
    hideFromConsole,
    files
  } = opts;

  // SETUP LOGGER CONFIG
  if (!name) return false;
  hideFromConsole = hideFromConsole || false;
  files = files || [];

  // BUILD TRANSPORTS
  let transports = [];

  // CONSOLE
  if (!hideFromConsole) {
    transports.push(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(i => `(${i.timestamp} ${i.level}) : ${i.message}`)
      )
    }));
  }

  // FILES
  files.forEach((f, index) => {
    let { fileName, level } = f;
    fileName = fileName || `${name}_${index}`;
    let filePath = path.join(__basedir, 'logs', fileName, '.log');
    let config = { filename: filePath };
    if (level) config.level = level;
    transports.push(
      new winston.transports.File(config)
    )
  });

  // LOG CONFIGURATION
  const logConfiguration = {
    transports,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(i => JSON.stringify(i))
    )
  }

  // LOGGER
  return winston.createLogger(logConfiguration);

}
