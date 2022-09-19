const apiRoutes = async (app, options) => {
  app.register(require("./customers"), { prefix: "customers" });
  app.register(require("./warehouses"), { prefix: "warehouses" });
  app.register(require("./technicians"), { prefix: "technicians" });

  // app.register(require("./archive"), { prefix: "archive" })
  app.get("/", async (request, reply) => {
    return "No Data";
  });
};

module.exports = apiRoutes;
