import { SwaggerOptions } from "@fastify/swagger";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const configureSwagger = (): SwaggerOptions => {
  return {
    openapi: {
      info: {
        title: "API Services",
        version: "2.0.0",
      },
    
    //   components: {
    //     securitySchemes: {
    //       cookieAuth: {
    //         type: "apiKey",
    //         in: "cookie",
    //         name: "token",
    //       },
    //     },
    //   },
    },
    transform: jsonSchemaTransform,
  };
};
