module.exports = async ({ dio }) => {
  const DEBUG = dio.f.willShowMainLogger(__filename);
  const config = dio.c.main;

  // attach middleware
  await require("./authentication")({ dio });

  return DEBUG && dio.l.main.info("All middleware functions attached...");
}
