module.exports = async ({ dio }) => {
  const DEBUG = dio.f.willShowMainLogger(__filename);
  const config = dio.c.main;

  // attach routers
  await require("./test")({ dio });

  return DEBUG && dio.l.main.info("All http routers attached...");
}
