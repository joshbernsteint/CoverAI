import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import "dotenv/config"; // To read CLERK_API_KEY
import { UnauthorizedError } from "./utils/errors.js";
import configRoutes from "./api/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import * as fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname for ES Modules

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
        url: "https://cover-ai-server.vercel.app/",
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
  ], // Ensure paths are correct
};
const css = fs.readFileSync(
  path.resolve(__dirname, "../node_modules/swagger-ui-dist/swagger-ui.css"),
  "utf8"
);
const options = {
  customCss: css,
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs, options));

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

export default app;
