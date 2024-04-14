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

const clerkAuth = ClerkExpressRequireAuth({
  authorizedParties: [process.env.CLIENT_URL, ,process.env.WCLIENT_URL,process.env.LOCALHOST_URL],
});

router.post(
  "/manual",
  clerkAuth,
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
  clerkAuth,
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
        file,
        id,
        file.originalname
      );
      return res.status(200).json(data);
    } catch (error) {
      console.log("ERROR:", error.toString());
      return res.status(error.status || 500).json({ message: error.message });
    }
  }
);

router.get(
  "/all",
  clerkAuth,
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
    clerkAuth,
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
    clerkAuth,
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
    clerkAuth,
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
