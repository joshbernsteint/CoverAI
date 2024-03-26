import Router from "express";
import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';

const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  genLetter,
  genBasicLetter,
  getCoverLetterById,
  updateCoverLetter,
  getAllCoverLettersFromUser,
} from "./covers.service.js";

router.route("/test").get((req, res) => {
  res.json({ message: "Hello, world!" });
});

router
  .route("/genCoverLetter")
  .post(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async (req, res, next) => {
      try {
        const user_id = req.auth.sessionClaims.sub;
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
    }
  );

router.route("/genBasicLetter").post(async (req, res, next) => {
  try {
    const description = req.body.description;
    const response = await genBasicLetter(description);
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router
  .route("/updateCoverLetter")
  .patch(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async (req, res) => {
      const cover_id = req.body.cover_id;
      const description = req.body.description;
      const response = await updateCoverLetter(cover_id, description);
      return res.status(200).json(response);
    }
  );


router
  .route("/getAllCoverLetters")
  .get(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async (req, res) => {
      const user_id = req.auth.sessionClaims.sub;
      const response = await getAllCoverLettersFromUser(user_id);
      return res.status(200).json(response);
    }
  );

router
  .route("/getCoverLetterById/:id")
  .get(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async (req, res) => {
      const cover_id = req.params.id;
      const response = await getCoverLetterById(cover_id);
      return res.status(200).json(response);
    }
  );


  router.route("/makeFileFromLast").get(ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }), async (req,res) => {
    const user_id = req.auth.sessionClaims.sub;
    const allCls = await getAllCoverLettersFromUser(user_id);
    const mostRecent = allCls[allCls.length - 1];
    const fileName = 'temp_cl.pdf'
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(fileName));
  
    for (const paragraph of mostRecent.paragraphs) {
      doc.text(paragraph);
      doc.moveDown();
    }
    doc.end();
    const absPath = path.resolve(fileName);
    res.sendFile(absPath, () => res.end());
  
  });
  
  router.route("/makeFileFromId/:id").get(ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }), async (req,res) => {
      const cover_id = req.params.id;
      const response = await getCoverLetterById(cover_id);
      const fileName = 'temp_cl.pdf'
      const doc = new PDFDocument();
      console.log(response.paragraphs);
      doc.pipe(fs.createWriteStream(fileName));
    
      for (const paragraph of response.paragraphs) {
        doc.text(paragraph);
        doc.moveDown();
      }
      doc.end();
      const absPath = path.resolve(fileName);
      res.sendFile(absPath, () => res.end());
  });

export default router;
