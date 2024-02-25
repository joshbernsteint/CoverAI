import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { genCoverLetter } from "./covers.service.js";

router
  .route("/genCoverLetter")
  .get(ClerkExpressRequireAuth(), async (req, res) => {
    genCoverLetter("Google", "Software Engineer");
    return res.status(200).json({ message: "Cover letter generated" });
  });

export default router;
