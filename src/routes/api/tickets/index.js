// Dependencies
const { TicketsService } = require("../../../services/tickets");
const { WarehouseService } = require("../../../services/warehouses");

// [DESCRIPTION 📋] Plugin for handeling the technicians routes
const ticketsRoutes = async (app, options) => {
  const ticketsService = new TicketsService();
  const warehouseService = new WarehouseService();

  // Get All
  app.get("/", {}, async (request, reply) => {
    let { technician } = request.query;
    app.log.info("request.query", request.query);
    const ticketsData = await ticketsService.getAll(technician);
    app.log.info("ticketsData", ticketsData);
    return { table: "tickets", data: ticketsData };
  });

  // Get One
  app.get("/:ticketId", {}, async (request, reply) => {
    const {
      params: { ticketId }
    } = request;
    app.log.info("ticketId", ticketId);

    const ticketsData = await ticketsService.getOne(ticketId);
    return ticketsData;
  });

  app.post("/", async (request, reply) => {
    const { body } = request;
    // Create the ticket
    const created = await ticketsService.create(body);
    // Update the stock on the warehouse
    let res = await warehouseService.update(body.warehouse_id, {
      key: body.hardware,
      value: "subtract"
    });

    reply
      .code(200)
      .header("Content-Type", "application/json; charset=utf-8")
      .send(created);
  });

  app.delete("/:ticketId", async (request, reply) => {
    const {
      params: { ticketId }
    } = request;
    app.log.info("ticketId", ticketId);
    const deleted = await ticketsService.delete(ticketId);
    // Update the stock on the warehouse
    let res = await warehouseService.update(deleted.warehouse_id, {
      key: deleted.hardware,
      value: "add"
    });
    return deleted;
  });
};

module.exports = ticketsRoutes;
