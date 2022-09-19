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
    app.log.info("request.query", request.query);
    let filter = {};
    // console.log(request.query);
    if (request.query.aggregate === "true") {
      filter = {
        aggregate: true,
        show_name: request.query.show_name,
        artistswarehouse_date: request.query.artists,
        warehouse_date: request.query.warehouse_date,
        loaction: request.query.loaction,
        date_range: request.query.date_range,
        date_range_start: request.query.date_range_start
      };
    } else if (request.query.limit && request.query.skip) {
      filter = {
        limit: Number(request.query.limit),
        skip: Number(request.query.skip)
      };
    } else if (request.query.customSearchName) {
      filter = {
        customSearchName: request.query.customSearchName,
        customID: request.query.customID,
        customExtraID: request.query.customExtraID,
        type: request.query.type
      };
    } else if (request.query.show_name) {
      filter = {
        autocomplete: true,
        show_name: request.query.show_name
      };
    } else if (request.query.price_percentile) {
      filter = {
        price_percentile: true,
        price: request.query.price_percentile,
        genre: request.query.genre_name
      };
    } else if (request.query.repetition_percentile) {
      filter = {
        repetition_percentile: true,
        warehouse_name: request.query.repetition_percentile,
        genre: request.query.genre_name
      };
    }

    const warehousesData = await warehouseService.getAll(filter);
    // console.log(warehousesData)
    return warehousesData;
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
