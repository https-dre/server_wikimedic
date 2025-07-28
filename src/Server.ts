import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import SwaggerUi from "@fastify/swagger-ui";

import { mongo as Database } from "./data/mongoDB/conn";
import { routes } from "./routers/Medicine";
import { ServerErrorHandler } from "./error-handler";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(import("@fastify/cors"));

app.register(import("@fastify/multipart"));

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Wikimedic API",
      description:
        "To run POST, PUT and DELETE, the request must have the APIKEY header.",
      version: "2.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(SwaggerUi, {
  routePrefix: "/docs",
});
app.setErrorHandler(ServerErrorHandler);
app.register(routes);

if (!process.env.APIKEY) {
  process.env.APIKEY = Math.random().toString();
  console.log(
    `Missing env APIKEY, new random APIKEY was generated: ${process.env.APIKEY}`
  );
}

app.addHook("onRequest", async (request, reply) => {
  const filter = ["post", "put", "delete"];
  const req_method = request.method.toLowerCase();
  const methods = filter.filter((e) => e == req_method);

  if (methods.length > 0) {
    // check API token
    const token = request.headers["apikey"];
    if (token != process.env.APIKEY) {
      return reply.code(401).send("Unauthorized");
    }
  }
});

const port = process.env.PORT || "7711";

const run = async () => {
  await app.ready();
  await Database.conn();

  try {
    const address = await app.listen({ port: Number(port), host: "0.0.0.0" });
    console.log("Server running at: ", address);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
