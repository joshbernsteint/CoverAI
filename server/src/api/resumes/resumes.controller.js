import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as resumeService from "./resumes.service.js";
import { UnexpectedError } from "../../utils/errors.js";
import multer from "multer";
import fs from "fs";

// var storage = multer.memoryStorage();
var storage = multer.diskStorage({
  destination: "/tmp",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post(
  "/manual",
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
  }),
  async (req, res) => {
    try {
      const resumeData = req.body;
      const id = req.auth.sessionClaims.sub;
      const data = await resumeService.createResumeFromJSON(resumeData, id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

router.post(
  "/",
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
  }),
  upload.single("file"),
  async (req, res) => {
    try {
      let file = req.file;
      const id = req.auth.sessionClaims.sub;
      if (!file) {
        throw new UnexpectedError("Invalid request");
      }
      // get file from tmp folder
      file = fs.readFileSync(file.path);
      // console.log(file);
      const data = await resumeService.createResumeFromPDF(
        {buffer: file},
        id,
        file.originalname
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log(error);
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

router.get(
  "/all",
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
  }),
  async (req, res) => {
    try {
      const id = req.auth.sessionClaims.sub;
      const data = await resumeService.getAllResumesById(id);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

router
  .route("/:id")
  .get(
    ClerkExpressRequireAuth({
      authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
    }),
    async (req, res) => {
      try {
        const id = req.params.id;
        const data = await resumeService.getResumeById(id);
        return res.status(200).json(data);
      } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
      }
    }
  )
  .put(
    ClerkExpressRequireAuth({
      authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
    }),
    upload.single("file"),
    async (req, res) => {
      try {
        const id = req.params.id;
        let file = req.file;
        const resumeData = req.body;
        const userId = req.auth.sessionClaims.sub;
        if (file) {
          file = fs.readFileSync(file.path);
          const data = await resumeService.updateResumeById(
            id,
            file,
            "pdf",
            userId,
            file.originalname
          );
          return res.status(200).json(data);
        }
        const data = await resumeService.updateResumeById(
          id,
          resumeData,
          "json",
          userId
        );
        return res.status(200).json(data);
      } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
      }
    }
  )
  .delete(
    ClerkExpressRequireAuth({
      authorizedParties: [process.env.CLIENT_URL, process.env.LOCALHOST_URL],
    }),
    async (req, res) => {
      try {
        const id = req.params.id;
        const data = await resumeService.deleteResumeById(id);
        return res.status(200).json(data);
      } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
      }
    }
  );

export default router;
