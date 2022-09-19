const { build } = require("./app");

build().then(app => {
  // run the server!
  app.listen(7000, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }

    app.log.info(`server listening on ${address}`);

    process.on("SIGINT", () => app.close());
    process.on("SIGTERM", () => app.close());
  });
});
