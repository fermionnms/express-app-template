// external libraries
const dotenv = require("dotenv");

// load env variables
dotenv.config();

// global variables
global.__basedir = __dirname;

// DEPENDENCY INJECTION OBJECT
let dio = {
  c: {
    main: require("./config/main"),
    debug: require("./config/debug"),
    test: require("./config/test"),
  },
  f: {},
  interfaces: {
    http: {
      routers: {},
      middleware: {}
    }
  },
  l: {},
  connections: {},
  controllers: {},
  models: {}
}

// set isRunningTests variable
let node_env = dio.c.main.node_env;
dio.isRunningTests = node_env === "test";

// Only invoke _START if not in test mode
if (!dio.isRunningTests) _START();
exports._START = _START;

async function _START() {

  try {

    //===============================================================
    //setup common functions
    await require("./lib/functions")({ dio });

    //===============================================================
    //setup loggers
    await require("./lib/logging")({ dio });

    //===============================================================
    //setup connections
    await require("./lib/connections")({ dio });

    //===============================================================
    //setup models
    await require("./app/models")({ dio });

    //===============================================================
    //setup controllers
    await require("./app/controllers")({ dio });

    //===============================================================
    //setup interfaces
    await require("./lib/interfaces")({ dio });

    if (!dio.isRunningTests) dio.l.main.info("app started successfully...");

    return dio;
  }

  catch (err) {
    console.error("Error starting app");
    console.error(err);
    throw err;
  }
}
