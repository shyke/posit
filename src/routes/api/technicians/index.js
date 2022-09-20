/*
 *
 *  Routes for handeling the technicians API
 *
 */

// Dependencies
const { TechnicianService } = require("../../../services/technicians");

// [DESCRIPTION 📋] Plugin for handeling the technicians routes
const technicianRoutes = async (app, options) => {
  const technicianService = new TechnicianService(app);

  // Get All
  app.get("/", {}, async (request, reply) => {
    app.log.info("request.query", request.query);
    const technicianData = await technicianService.getAll();
    app.log.info("technicianData", technicianData);
    return { table: "technicians", data: technicianData };
  });

  // Get One
  app.get("/:technicianId", {}, async (request, reply) => {
    const {
      params: { technicianId }
    } = request;
    app.log.info("technicianId", technicianId);

    const technicianData = await technicianService.getOne(technicianId);
    return technicianData;
  });
};

module.exports = technicianRoutes;
