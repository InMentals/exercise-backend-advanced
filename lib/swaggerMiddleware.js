import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.4",
    info: {
      title: "NodePop",
      version: "1.0.0",
    },
  },
  apis: ["swagger.yaml"],
  // apis: ["./src/routes*.js"], // files containing annotations as above
};

const specification = swaggerJSDoc(options);

export default [swaggerUI.serve, swaggerUI.setup(specification)];
