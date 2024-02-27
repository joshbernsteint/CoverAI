import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { genCoverLetter, genBasicLetter } from "./covers.service.js";

/**
 * @swagger
 * /covers/genCoverLetter:
 *   post:
 *     summary: Generates a personalized cover letter.
 *     description: This endpoint generates a personalized cover letter based on the employer's name and the job title provided by the user. It requires authentication.
 *     tags: [Cover Letters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employer_name:
 *                 type: string
 *                 description: The name of the employer or the company.
 *                 example: "Acme Corp"
 *               job_title:
 *                 type: string
 *                 description: The title of the job for which the cover letter is being generated.
 *                 example: "Software Engineer"
 *     responses:
 *       200:
 *         description: Successfully generated the cover letter.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 date:
 *                   type: string
 *                 employer_name:
 *                   type: string
 *                 greeting:
 *                   type: string
 *                 first_paragraph:
 *                   type: string
 *                 second_paragraph:
 *                   type: string
 *                 third_paragraph:
 *                   type: string
 *                 closing_statement:
 *                   type: string
 *                 signature:
 *                   type: string
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal Server Error. An error occurred during the process.
 */

router.route("/genCoverLetter").post(
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL],
  }),
  async (req, res) => {
    console.log(req.headers);
    const employer_name = req.body.employer_name;
    const job_title = req.body.job_title;
    const response = await genCoverLetter(employer_name, job_title);
    return res.status(200).json(response);
  }
);

router.route("/genBasicLetter").post(async (req, res) => {
  const description = req.body.description;
  const response = await genBasicLetter(description);
  return res.status(200).json(response);
});
export default router;
