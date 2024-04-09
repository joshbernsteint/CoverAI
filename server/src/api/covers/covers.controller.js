import Router from "express";
import fs from "fs";
import PDFDocument from "pdfkit";
import path from "path";

const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  genLetter,
  genBasicLetter,
  getCoverLetterById,
  updateCoverLetter,
  getAllCoverLettersFromUser,
  deleteCoverLetter,
} from "./covers.service.js";

// Middleware for authenticating requests
const authenticateRequest = ClerkExpressRequireAuth({
  authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
});

router.post("/", authenticateRequest, async (req, res, next) => {
  try {
    const user_id = req.auth.sessionClaims.sub || process.env.TEST_USER_ID;
    const {
      company_name,
      job_title,
      useResume,
      resumeData,
      useScraper,
      scrapedData,
    } = req.body;

    const response = await genLetter(
      user_id,
      company_name,
      job_title,
      useResume,
      resumeData,
      useScraper,
      scrapedData
    );

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.route("/all").get(authenticateRequest, async (req, res, next) => {
  try {
    const user_id = req.auth.sessionClaims.sub || process.env.TEST_USER_ID;
    const response = await getAllCoverLettersFromUser(user_id);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router
  .route("/:id")
  .get(authenticateRequest, async (req, res, next) => {
    try {
      const cover_id = req.params.id;
      const response = await getCoverLetterById(cover_id);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  })
  .patch(authenticateRequest, async (req, res, next) => {
    try {
      const cover_id = req.params.id;
      const description = req.body.description;
      const response = await updateCoverLetter(cover_id, description);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  })
  .delete(authenticateRequest, async (req, res, next) => {
    try {
      const cover_id = req.params.id;
      const response = await deleteCoverLetter(cover_id);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

router.route("/makeFileFromLast").get(authenticateRequest, async (req, res) => {
  const user_id = req.auth.sessionClaims.sub;
  const allCls = await getAllCoverLettersFromUser(user_id);
  const mostRecent = allCls[allCls.length - 1];
  const fileName = "temp_cl.pdf";
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(fileName));
  doc.font("Times-Roman");
  for (const paragraph of mostRecent.paragraphs) {
    doc.text(paragraph);
    doc.moveDown();
  }
});

router
  .route("/makeFileFromId/:id")
  .get(authenticateRequest, async (req, res) => {
    const cover_id = req.params.id;
    const response = await getCoverLetterById(cover_id);
    const fileName = "temp_cl.pdf";
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(fileName));
    doc.font("Times-Roman");
    for (const paragraph of response.paragraphs) {
      doc.text(paragraph);
      doc.moveDown();
    }
    doc.end();
    const absPath = path.resolve(fileName);
    res.sendFile(absPath, () => res.end());
  });

export default router;
