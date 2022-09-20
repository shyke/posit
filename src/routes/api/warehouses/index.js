/*
 *
 *  Routes for handeling the warehouses API
 *
 */

// Dependencies
const { WarehouseService } = require("../../../services/warehouses");

// [DESCRIPTION 📋] Plugin for handeling the warehouses routes
const warehouseRoutes = async (app, options) => {
  const warehouseService = new WarehouseService(app);

  // Get All
  app.get("/", {}, async (request, reply) => {
    const warehousesData = await warehouseService.getAll();
    // console.log(warehousesData)
    return { table: "warehouses", data: warehousesData };
  });

  // Get One
  app.get("/:warehouseId", {}, async (request, reply) => {
    const {
      params: { warehouseId }
    } = request;
    app.log.info("warehouseId", warehouseId);

    const warehouseData = await warehouseService.getOne(warehouseId);
    return warehouseData;
  });

  // Update => 📋 NOTE: Commented out becouse warehouses API does not need for thime being a way to update warehouses.
  app.patch("/:warehouseId", {}, async (request, reply) => {
    const {
      params: { warehouseId }
    } = request;

    const { body } = request;
    app.log.info("warehouseId", warehouseId);
    app.log.info("body", body);

    const updated = await warehouseService.update({
      id: warehouseId,
      data: body
    });

    return updated;
  });
};

module.exports = warehouseRoutes;
