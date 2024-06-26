import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import "dotenv/config"; // To read CLERK_API_KEY
import { UnauthorizedError } from "./utils/errors.js";
import configRoutes from "./api/index.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import yaml from "js-yaml";
import * as fs from "node:fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Define __dirname for ES Modules

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get("/ping", async function (req, res) {
  return res.status(200).json({
    ping: "pong",
  });
});

const swaggerDocument = yaml.load(
  fs.readFileSync(path.join(__dirname, "./swagger.yaml"), "utf8")
);
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
        url: "https://cover-ai-server-three.vercel.app/",
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
      schemas: {
        ResumeData: {
          type: "object",
          properties: {
            userId: { type: "string", description: "The ID of the user" },
            resumeType: {
              type: "string",
              description: 'The type of the resume (e.g., "pdf")',
            },
            extractedText: {
              type: "string",
              description: "The extracted text from the resume",
            },
            extractedSections: {
              type: "array",
              items: { type: "string" },
              description: "Array of extracted sections from the resume",
            },
            pdfJSON: {
              type: "object",
              properties: {
                name: { type: "string", description: "The name of the user" },
                email: {
                  type: "string",
                  format: "email",
                  description: "The email address of the user",
                },
                phone: {
                  type: "string",
                  description: "The phone number of the user",
                },
              },
              additionalProperties: true, // Allow dynamic values
              description: "Additional JSON data related to the PDF",
            },
          },
        },
      },
    },
  },
  apis: [
    "./src/api/users/users.controller.js",
    "./src/api/covers/covers.controller.js",
    "./src/api/resumes/resumes.controller.js",
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
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, options)
);

configRoutes(app);

const publicPath = path.resolve('../client/dist');
app.use(express.static(publicPath));

app.get('*', async (req,res) => {
  res.sendFile(publicPath + '/index.html');
});

app.use((err, req, res, next) => {
  // --> This handles auth errors
  // --> Maybe move this to a middleware file with function below
  if (err.message === "Unauthenticated") throw new UnauthorizedError();
  next(err);
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
