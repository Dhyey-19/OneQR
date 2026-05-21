const swaggerJSDoc = require("swagger-jsdoc");
const config = require("./config");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "OneQR API Documentation",
      version: "1.0.0",
      description: "API documentation for the OneQR application authentication and services.",
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>",
        },
      },
    },
  },
  // Locate route files with JSDoc swagger comments
  apis: ["./src/routes/*.js", "./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
