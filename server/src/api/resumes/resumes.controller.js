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
 *
 * /resumes/manual:
 *   post:
 *     summary: Create Resume from JSON
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: JSON data for resume
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResumeData'
 *     responses:
 *       '200':
 *         description: Successfully created resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumeData'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post(
  "/manual",
  // ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
  async (req, res) => {
    try {
      const resumeData = req.body;
      // const id = req.auth.sessionClaims.sub;
      const id = "65f74a1ef1a8f10d860bb03f";
      const data = await resumeService.createResumeFromJSON(resumeData, id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 *
 * /resumes:
 *   post:
 *     summary: Upload PDF to create resume
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
 *     responses:
 *       '200':
 *         description: Successfully created resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumeData'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.post(
  "/",
  upload.single("file"),
  // ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
  async (req, res) => {
    try {
      const file = req.file;
      // const id = req.auth.sessionClaims.sub;
      const id = "65f74a1ef1a8f10d860bb03f";
      if (!file) {
        throw new UnexpectedError("Invalid request");
      }
      const data = await resumeService.createResumeFromPDF(file, id);
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 *
 * /resumes/all:
 *   get:
 *     summary: Get all resumes by user ID
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of resumes belonging to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResumeData'
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get(
  "/all",
  // ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
  async (req, res) => {
    try {
      // const id = req.auth.sessionClaims.sub;
      const id = "65f74a1ef1a8f10d860bb03f";
      const data = await resumeService.getAllResumesById(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 *
 * /resumes/{id}:
 *   get:
 *     summary: Get Resume by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Retrieved resume
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumeData'
 *       '404':
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get(
  "/:id",
  // ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
  async (req, res) => {
    try {
      const id = req.params.id;
      const data = await resumeService.getResumeById(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

/**
 * @swagger
 *
 * /{id}:
 *   put:
 *     summary: Update a resume by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResumeData'
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF file to upload
 *     responses:
 *       '200':
 *         description: Resume updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResumeData'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const file = req.file;
    const resumeData = req.body;
    if (file) {
      const data = await resumeService.updateResumeById(id, file, "pdf");
      return res.status(200).json(data);
    }
    const data = await resumeService.updateResumeById(id, resumeData, "json");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

/**
 * @swagger
 *
 * /resumes/{id}:
 *   delete:
 *     summary: Delete a resume by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Resume ID
 *     tags: [Resumes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Resume deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *       '404':
 *         description: Resume not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await resumeService.deleteResumeById(id);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});

export default router;
