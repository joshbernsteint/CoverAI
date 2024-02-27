import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { genCoverLetter, genBasicLetter } from "./covers.service.js";

router
  .route("/genCoverLetter")
  .get(ClerkExpressRequireAuth(), async (req, res) => {
    genCoverLetter("Google", "Software Engineer");
    return res.status(200).json({ message: "Cover letter generated" });
  });

router.route("/genBasicLetter").post(async (req, res) => {
  const description = req.body.description;
  const response = await genBasicLetter(description);
  return res.status(200).json(response);
});
export default router;
