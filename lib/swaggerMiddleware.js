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
  apis: ["swagger.yaml"], //TODO change the docu in the file swagger.yaml or add the docu in the contollers in each block like in the lesson repo

  // apis: ["controllers/**/*.js"], // files containing annotations as above
};

const specification = swaggerJSDoc(options);

export default [swaggerUI.serve, swaggerUI.setup(specification)];
