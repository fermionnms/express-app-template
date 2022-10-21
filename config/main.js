// initialize empty config object
let c = {};

//NODE
c.node_env = process.env.NODE_ENV || "development";

// LOGGING
c.logging = {};
c.logging.loggers = [
  // {
  //   name: 'test1',
  //   hideFromConsole: false,
  //   files: [
  //     { fileName: "test1_all" },
  //     { fileName: "test1_error", level: "error" }
  //   ]
  // },
  // {
  //   name: 'test2',
  //   hideFromConsole: true,
  //   files: [
  //     { fileName: "test2_all" },
  //     { fileName: "test1_all" }
  //   ]
  // }
];

// DEFAULTS
c.defaults = {};

//UUID
c.uuid = {};
c.uuid.namespaces = {};
c.uuid.namespaces.default = "b46c2b79-de25-4992-9cd3-6b140b46aaa9";

//INTERFACES
c.interfaces = {};
c.interfaces.http = {};
c.interfaces.http.port = process.env.HTTP_PORT || 3000;
c.interfaces.http.routerPrefix = `/api/${
  process.env.API_VERSION || "v1"
}/`;

// SECURITY
c.security = {};
c.security.serviceAPIKeyHeaderName =
  "app-service-identifier-apikey";
c.security.serviceAPIKeys = require("./serviceAPIKeys") || [];

//MONGODB
c.mongo = {};
c.mongo.connecturl =
  process.env.MONGO_CONNECT_URL || "mongodb://127.0.0.1:27017";
c.mongo.db = process.env.MONGO_CONNECT_DB || "test";
c.mongo.authSource = process.env.MONGO_CONNECT_AUTHSOURCE || "admin";

// EXPORT
module.exports = c;
