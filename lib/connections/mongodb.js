const mongoose = require("mongoose");

module.exports = async ({ dio }) => {
  const config = dio.c.main;
  const DEBUG = dio.f.willShowMainLogger(__filename);

  try {

    dio.connections.mongo = mongoose.connection;

    // default connection settings
    let connectionString = `${config.mongo.connecturl}/${config.mongo.db}?authSource=admin`;
    let connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    if (dio.isRunningTests) {

      // if this is in test mode then create mongodb in ram
      const { MongoMemoryServer } = require("mongodb-memory-server");
      let mongo = await MongoMemoryServer.create();

      // change default connection settings
      connectionString = mongo.getUri();
      connectionOptions.dbName = config.mongo.db;

      // https://www.makeuseof.com/mongoose-models-test-with-mongo-memory-server/
      // need to create a function to drop the database and collections
      dio.connections.mongo.dropDB = async () => {
        if (mongo) {
          await mongoose.connection.dropDatabase();
          await mongoose.connection.close();
          await mongo.stop();
        }
      };

    }

    // connect using settings at this point in the code execution
    mongoose.connect(connectionString, connectionOptions).then(
      () => {
        /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        DEBUG && dio.l.main.info("MongoDB / Mongoose connected");
      },
      err => {
        /** handle initial connection error */
        !dio.isRunningTests && dio.l.main.error("MongoDB / Mongoose failed", err);
      }
    );

    //===============================================================
    //done
    return DEBUG && dio.l.main.info("MongoDB connection attached...");
  } catch (err) {
    return !dio.isRunningTests && dio.l.main.error(err.toString());
  }
};
