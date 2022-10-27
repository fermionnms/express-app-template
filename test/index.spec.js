const { _START } = require("../app");

describe('pre-tests setup in progress...', async function () {

  let dio;
  before(async () => {
    dio = await _START();
  })


  await (() => {
    return new Promise((resolve, reject) => {
      it("pre-tests setup complete", async function() {

        await require("../lib/tests")({ dio });
        resolve();

      })
    })
  })();

  after(async () => {
    // drop mongodb from ram
    console.log("killing mongo here")
    dio.connections.mongo.dropDB && await dio.connections.mongo.dropDB();
  })
});
