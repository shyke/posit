const path = require("path");
const Fastify = require("fastify");
const { TechnicianService } = require("./services/technicians");

// const cors = require('cors');

// order to register / load
// 1. plugins (from the Fastify ecosystem)
// 2. your plugins (your custom plugins)
// 3. decorators
// 4. hooks and middlewares
// 5. your services

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

  // await fastify.register(require("fastify-express"));
  // await fastify.register(require("./plugins/knex-db-connector"), {});

  await fastify.register(require("./routes/api"), { prefix: "api" });
  // await fastify.register(require("./routes/front-end"), { prefix: "posit" });

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

  // middlewares
  // fastify.use(cors());

  return fastify;
};

// implement inversion of control to make the code testable
module.exports = {
  build
};
