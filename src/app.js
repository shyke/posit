const path = require("path");
const Fastify = require("fastify");
const { TechnicianService } = require("./services/technicians");

const build = async () => {
  const fastify = Fastify({
    bodyLimit: 1048576 * 2,
    logger: {}
  });

  // plugins

  await fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/public/" // optional: default '/'
  });

  // await require("make-promises-safe");

  await fastify.register(require("@fastify/view"), {
    engine: {
      ejs: require("ejs")
    }
  });

  await fastify.register(require("./routes/api"), { prefix: "api" });

  fastify.get("/", async function(request, reply) {
    const technicianService = new TechnicianService();
    const technicianData = await technicianService.getAll();
    return reply.view("src/views/home.ejs", { technicianData });
  });

  fastify.setNotFoundHandler(
    {
      preValidation: (req, reply, done) => {
        //return reply.view("src/views/pages/404.ejs");
        return "404";
        done();
      },
      preHandler: (req, reply, done) => {
        //return reply.view("src/views/pages/404.ejs");
        return "404";
        done();
      }
    },
    function(request, reply) {
      //return reply.view("src/views/pages/404.ejs");
      return "404";
    }
  );

  // hooks
  fastify.addHook("onClose", (instance, done) => {});

  return fastify;
};

module.exports = {
  build
};
