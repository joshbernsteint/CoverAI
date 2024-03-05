import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as resumeService from "./resumes.service.js";
import { UnexpectedError } from "../../utils/errors.js";
import multer from "multer";

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

/**
 * @swagger
 * /resumes/manual:
 *  post:
 *    summary: Create a resume from a PDF.
 *    description: Create a resume from a PDF file.
 *    tags: [Resumes]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                description: PDF file path
 *                required: true
 *        example:
 *          file: ../../public/examples/JoshuaGorman_Resume2024a.pdf
 *    responses:
 *      200:
 *        description: Resume created
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: string
 *                  format: uuid
 *                  description: The unique identifier for the resume.
 *                  example: "resume_2bSO2FvIlVSIAXMUOGr5v1fCGIG"
 *      400:
 *        description: Invalid request
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                type: string
 *                description: Error message
 *                example: "Invalid request"
 *     500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  description: Error message
 *                  example: Internal Server Error
 */
router.post("/manual", async (req, res) => {
  try {
    const { resumeData } = req.body;
    const id = "id";
    const data = await resumeService.createResumeFromJSON(resumeData, id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /resumes:
 * post:
 *    summary: Create a resume
 *    description: Create a resume from a PDF file
 *    tags: [Resumes]
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              file:
 *                type: string
 *                format: binary
 *                description: PDF file
 *                responses:
 *                  200:
 *                  description: Resume created
 *                  content:
 *                    application/json:
 *                      schema:
 *                        type: object
 *                        properties:
 *                          id:
 *                          type: string
 *                          format: uuid
 *                          description: The unique identifier for the resume.
 *                          example: resume_2bSO2FvIlVSIAXMUOGr5v1fCGIG
 *                  400:
 *                    description: Invalid request
 *                    content:
 *                      application/json:
 *                        schema:
 *                          type: object
 *                          properties:
 *                            message:
 *                              type: string
 *                              description: Error message
 *                              example: Invalid request
 *                  500:
 *                    description: Internal Server Error
 *                    content:
 *                      application/json:
 *                        schema:
 *                          type: object
 *                          properties:
 *                            message:
 *                              type: string
 *                              description: Error message
 *                              example: Internal Server Error
 */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      throw new UnexpectedError("Invalid request");
    }
    const id = "id";
    const data = await resumeService.createResumeFromPDF(file, id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ! add swagger
// gets a resume by id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await resumeService.getResumeById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ! add swagger
// gets all resumes by user id
router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await resumeService.getAllResumesById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
