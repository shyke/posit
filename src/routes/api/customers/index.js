// Dependencies
const { CustomerService } = require("../../../services/customers");

// [DESCRIPTION 📋]
const customerRoutes = async (app, options) => {
  const customerService = new CustomerService();

  // Get All
  app.get("/", {}, async (request, reply) => {
    app.log.info("request.query", request.query);
    const customersData = await customerService.getAll();
    app.log.info("customersData", customersData);
    return { table: "customers", data: customersData };
  });

  // Get One
  app.get("/:customerId", {}, async (request, reply) => {
    const {
      params: { customerId }
    } = request;

    app.log.info("customerId", customerId);

    const customerData = await customerService.getOne(customerId);
    return customerData;
  });
};

module.exports = customerRoutes;
