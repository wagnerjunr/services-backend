import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";

import fastifySwagger from "@fastify/swagger";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { configureSwagger } from "./config/swagger.js";
import fastifySwaggerUi from "@fastify/swagger-ui";
import UsersModule from "./modules/users/index.js";
import fastifyJWT from "@fastify/jwt";
import AuthModule from "./modules/auth/index.js";

export const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, { origin: true, credentials: true }); //Permite requisição de qualquer lugar e com credenciais

app.register(fastifyCookie);
app.register(fastifyJWT, {
  secret: "123456789",
});

// Documentation
app.register(fastifySwagger, configureSwagger());
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", () => {
  return "Hello World";
});

app.register(UsersModule, { prefix: "/users" });

app.register(AuthModule, { prefix: "/auth" });
