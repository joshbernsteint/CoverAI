import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import "dotenv/config"; // To read CLERK_API_KEY
import { UnauthorizedError } from "./utils/errors.js";
import configRoutes from "./api/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", async function (req, res) {
  return res.status(200).json({
    ping: "pong",
  });
});

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // More streamlined
    info: {
      title: "CoverAI API",
      version: "1.0.0",
      description: "CoverAI API Documentation",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Format
        },
      },
    },
  },
  apis: [
    "./src/api/users/users.controller.js",
    "./src/api/covers/covers.controller.js",
    // "./src/api/resumes/resumes.controller.js",
  ], // Ensure paths are correct
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

configRoutes(app);

app.use((err, req, res, next) => {
  // --> This handles auth errors
  // --> Maybe move this to a middleware file with function below
  if (err.message === "Unauthenticated") throw new UnauthorizedError();
  next();
});

app.use(function (err, req, res, next) {
  // --> Same for this
  const status = err.status || 500;
  const message = err.message;
  // console.error(err.stack);
  return res.status(status).json({
    error: { message, status },
  });
});

app.listen(3000, function () {
  console.log(`🚀 Server running on ${process.env.SERVER_URL}`);
});
