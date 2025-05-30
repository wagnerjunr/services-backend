import fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import formbody from "@fastify/formbody";
import fastifySwagger from "@fastify/swagger";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { fastifyCors } from "@fastify/cors";
import { configureSwagger } from "./config/swagger.js";
import { MultipartFile } from "@fastify/multipart";
import fastifySwaggerUi from "@fastify/swagger-ui";
import UsersModule from "./modules/users/index.js";
import fastifyJWT from "@fastify/jwt";
import AuthModule from "./modules/auth/index.js";
import MediaFileModule from "./modules/mediafile/index.js";
import { ChatModule } from "./modules/chat/index.js";

declare module '@fastify/multipart' {
  interface MultipartFile {
    value: Buffer;
  }
}
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

app.register(multipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  async onFile(part: MultipartFile) {
    const buffer = await part.toBuffer();
    part.value = buffer;
  },
});
app.register(formbody);

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});

app.get("/", () => {
  return "Hello World";
});

app.register(UsersModule, { prefix: "/users" });

app.register(AuthModule, { prefix: "/auth" });

app.register(MediaFileModule, { prefix: "/mediafile" })

app.register(ChatModule, { prefix: "/chat" })
