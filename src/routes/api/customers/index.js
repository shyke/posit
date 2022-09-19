// Dependencies
const { CustomerService } = require("../../../services/customers");

// [DESCRIPTION 📋]
const customerRoutes = async (app, options) => {
  const customerService = new CustomerService();

  // Create => 📋 NOTE: Commented out becouse events API does not need for thime being a way to create events.
  app.post("/", {}, async (request, reply) => {
    const { body } = request;

    const created = await customerService.create({ customer: body });

    return created;
  });

  // Get All
  app.get("/", {}, async (request, reply) => {
    app.log.info("request.query", request.query);
    const customersData = await customerService.getAll();
    app.log.info("customersData", customersData);
    return customersData;
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

  // Update
  app.patch("/:customerId", {}, async (request, reply) => {
    const {
      params: { customerId }
    } = request;

    const { body } = request;
    app.log.info("customerId", customerId);
    app.log.info("body", body);

    const updated = await customerService.update({
      id: customerId,
      customer: body
    });

    return updated;
  });

  // delete

  // Delete 📋 NOTE: Commented out becouse events API does not need for thime being a way to delete events.
  /*
  app.delete("/:eventId", { }, async (request, reply) => {
    const {
      params: { personId }
    } = request;

    app.log.info("personId", personId);

    const deleted = await personService.delete({ id: personId });
    return deleted;
  });
  */
};

module.exports = customerRoutes;
