const _ = require("lodash");
const { v5: uuidv5, v4: uuidv4 } = require("uuid");

module.exports = async ({ dio }) => {
  const debug = dio.c.debug;
  const testConfig = dio.c.test;
  const config = dio.c.main;

  // checks that a string is a uuid
  dio.f.checkStringIsUUID = (str) => {
    let res = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/.test(str);
    return !!res;
  }

  // generate a deterministic uuid
  dio.f.generateDeterministicUUID = (deterministicString, namespace) => {
    deterministicString = deterministicString || "";
    namespace = namespace || config.uuid.namespaces.default;
    return uuidv5(deterministicString, namespace);
  }

  // generate a random uuid in namespace
  dio.f.generateRandomUUIDWithNamespace = (namespace) => {
    let deterministicString = uuidv4();
    namespace = namespace || config.uuid.namespaces.default;
    return uuidv5(deterministicString, namespace);
  }

  // abstraction for 99% of http requests
  dio.f.handleHttpRequestForController = async opts => {

    // deconstruct the opts passed through
    let {
      ctlParams,
      ctlFunction,
      isRouterDebug,
      routerName,
      initialResult,
    } = (opts || {});

    // setup result object
    let defaultResult = { success: false, httpStatusCode: 500 };
    let result = {
      ...defaultResult,
      ...initialResult
    }

    try {

      // check ctlFunction exists
      if (!ctlFunction) throw new Error("ctlFunction not found");

      // let controller do the work
      let controllerResponse = await ctlFunction(ctlParams);

      // send appropriate http status code for empty response
      if (!controllerResponse) {
        result.httpStatusCode = 404;
        throw new Error("Received an empty controllerResponse!");
      }

      // did controller succeed
      result.success = !!controllerResponse.success;
      // default status code unless controller override
      result.httpStatusCode = controllerResponse.httpStatusCode || (result.success ? 200 : 500);
      // merge with rest of controllerResponse
      result = {
        ...controllerResponse,
        ...result
      }

      // force error
      if (!result.success) {
        throw new Error("Unsuccessful controller response!");
      }

      // handle as success
      isRouterDebug && dio.l.main.info(JSON.stringify(result, null, 4));
      return result;
    }

    catch (err) {
      // handle as error
      if (!dio.isRunningTests) !dio.isRunningTests && dio.l.main.error(`Error on the ${routerName} router!`);
      if (!result.err) result.err = {
        error: err,
        message: err.toString()
      };
      isRouterDebug && !dio.isRunningTests && dio.l.main.error(err.toString());
      return result;
    }
  }

  // reads from the debug config to determine whether or not to show any main logger output for that file
  dio.f.willShowMainLogger = (fileName) => {

    if (dio.isRunningTests) return false;

    // check if valid filepath
    if (fileName.indexOf(__basedir) !== 0) return true;

    // get relative file path
    let relativePath = fileName.slice(__basedir.length + 1);

    // get path in format for lodash
    let dotPath = relativePath.split("/").join(".");

    // remove file extension
    dotPath = dotPath.split(".").slice(0, -1).join(".");

    // read from debug file
    let debugConfigValue = _.get(debug, dotPath);

    return debugConfigValue === undefined ? true : debugConfigValue;
  };

  // reads from the test config to determine whether or not to run the test file
  dio.f.willRunTestFile = (fileName) => {

    if (!dio.isRunningTests) return false;

    // check if valid filepath
    if (fileName.indexOf(__basedir) !== 0) return true;

    // get relative file path
    let relativePath = fileName.slice(__basedir.length + 11);

    // get path in format for lodash
    let dotPath = relativePath.split("/").join(".");

    // remove file extension
    dotPath = dotPath.split(".").slice(0, -1).join(".");

    // read from test config file
    let testConfigValue = _.get(testConfig, dotPath);

    return testConfigValue === undefined ? true : testConfigValue;
  };

  return;
};
