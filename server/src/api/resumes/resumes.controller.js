import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as resumeService from "./resumes.service.js";
import { UnexpectedError } from "../../utils/errors.js";
import multer from "multer";
import fs from "fs";


const TEMP_STORAGE = "/tmp/coverai";

// Clears the temporary storage directory
function clearStorage(){
  const files = fs.readdirSync(TEMP_STORAGE);
  for (const file of files) {
    fs.rmSync(`${TEMP_STORAGE}/${file}`);
  }
}

clearStorage();

var storage = multer.diskStorage({
  destination: TEMP_STORAGE,
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
var upload = multer({ storage: storage });

const clerkAuth = ClerkExpressRequireAuth({
  authorizedParties: [process.env.CLIENT_URL, process.env.WCLIENT_URL, process.env.LOCALHOST_URL],
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
      let filename = file.originalname;
      file = fs.readFileSync(file.path);
      const data = await resumeService.createResumeFromPDFAI(
        file,
        id,
        filename
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
