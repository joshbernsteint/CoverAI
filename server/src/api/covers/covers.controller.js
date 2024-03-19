import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  genLetter,
  genBasicLetter,
  getCoverLetterById,
  updateCoverLetter,
  getAllCoverLettersFromUser,
} from "./covers.service.js";

/**
 * @swagger
 * /covers/genCoverLetter:
 *   post:
 *     summary: Generates a personalized cover letter for a user
 *     description: >-
 *       This endpoint accepts details about a job application and, optionally, the user's resume and scraped job data,
 *       to generate a personalized cover letter. The cover letter is tailored based on the user's previous cover letters,
 *       educational background, experiences, and the specifics of the job being applied for.
 *     tags:
 *       - Cover Letters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employer_name:
 *                 type: string
 *                 description: The name of the employer.
 *                 example: 'Acme Corp'
 *               job_title:
 *                 type: string
 *                 description: The title of the job position.
 *                 example: 'Software Engineer'
 *               useResume:
 *                 type: boolean
 *                 description: Flag indicating whether to use the user's resume data.
 *                 example: false
 *               resumeData:
 *                 type: object
 *                 description: >-
 *                   An object containing the user's resume data, including extracted sections and PDF JSON data.
 *                   This parameter is optional and only used if useResume is true.
 *               useScraper:
 *                 type: boolean
 *                 description: Flag indicating whether to use scraped job data.
 *                 example: true
 *               scrapedData:
 *                 type: string
 *                 description: >-
 *                   A string containing scraped data about the job. This parameter is optional and only used if useScraper is true.
 *                 example: 'Details about the job responsibilities and requirements.'
 *     responses:
 *       200:
 *         description: Cover letter generated successfully.
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The updated paragraphs of the cover letter.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       404:
 *         description: Not found. Cover letter with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

router.route("/genCoverLetter").post(async (req, res, next) => {
  try {
    // const user_id = req.auth.sessionClaims.sub;
    const user_id = "user_2dC6mNNpMcxT5kubchWOsfUs2TB";
    const {
      employer_name,
      job_title,
      useResume,
      resumeData,
      useScraper,
      scrapedData,
    } = req.body;

    const response = await genLetter(
      user_id,
      employer_name,
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

router.route("/genBasicLetter").post(async (req, res) => {
  const description = req.body.description;
  const response = await genBasicLetter(description);
  return res.status(200).json(response);
});

/**
 * @swagger
 * paths:
 *   /covers/updateCoverLetter:
 *     patch:
 *       summary: Updates a specific cover letter
 *       description: >
 *         This endpoint updates an existing cover letter's content with the new description provided. It requires the cover letter ID and the new paragraphs as input.
 *       operationId: updateCoverLetter
 *       tags:
 *         - Cover Letters
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - cover_id
 *                 - description
 *               properties:
 *                 cover_id:
 *                   type: string
 *                   description: The unique identifier of the cover letter to be updated.
 *                 description:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The new paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *             example:
 *               cover_id: "623d6e9d9e2b6f001f2f5c7d"
 *               description:
 *                 - "Dear Hiring Manager,"
 *                 - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                 - "With my experience in software development..."
 *                 - "I believe my skills make me a perfect fit for this role..."
 *                 - "Thank you for considering my application."
 *                 - "Sincerely, John Doe"
 *       responses:
 *         '200':
 *           description: Successfully updated cover letter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The updated paragraphs of the cover letter.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *         '400':
 *           description: Bad request. Invalid input or missing fields.
 *         '401':
 *           description: Unauthorized. User is not authenticated.
 *         '404':
 *           description: Not found. Cover letter with the given ID does not exist.
 *         '500':
 *           description: Internal server error.
 */

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

/**
 * @swagger
 * paths:
 *   /covers/getAllCoverLetters:
 *     get:
 *       summary: Retrieves all cover letters from a user
 *       description: >
 *         This endpoint fetches all cover letters associated with a user, identified by their user ID.
 *       operationId: getAllCoverLetters
 *       tags:
 *         - Cover Letters
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *           description: Bearer token for authenticating the request.
 *       responses:
 *         '200':
 *           description: Successfully retrieved all cover letters
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: ObjectId
 *                       description: The unique identifier for the cover letter.
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: The unique identifier for the user.
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The date when the cover letter was generated.
 *                     first_name:
 *                       type: string
 *                       description: The first name of the user.
 *                     last_name:
 *                       type: string
 *                       description: The last name of the user.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The email address of the user.
 *                     employer_name:
 *                       type: string
 *                       description: The name of the employer or the company to which the cover letter is addressed.
 *                     paragraphs:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: An array containing the paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   - _id: ObjectID('623d6e9d9e2b6f001f2f5c7d')
 *                     user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                     date: "2024-03-04"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     email: "john.doe@example.com"
 *                     employer_name: "Acme Corp"
 *                     paragraphs:
 *                       - "Dear Hiring Manager,"
 *                       - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                       - "With my experience in software development..."
 *                       - "I believe my skills make me a perfect fit for this role..."
 *                       - "Thank you for considering my application."
 *                       - "Sincerely, John Doe"
 *         '401':
 *           description: Unauthorized. User is not authenticated.
 *         '500':
 *           description: Internal server error.
 */

router.route("/getAllCoverLetters").get(async (req, res) => {
  const user_id = req.auth.sessionClaims.sub;
  const response = await getAllCoverLettersFromUser(user_id);
  return res.status(200).json(response);
});

/**
 * @swagger
 * paths:
 *   /covers/getCoverLetterById/{id}:
 *     get:
 *       summary: Retrieves a specific cover letter by ID
 *       description: >
 *         This endpoint fetches a specific cover letter using its unique identifier provided as a path parameter.
 *       operationId: getCoverLetterById
 *       tags:
 *         - Cover Letters
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the cover letter to retrieve.
 *       responses:
 *         '200':
 *           description: Successfully retrieved cover letter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *         '400':
 *           description: Bad request. Invalid input or missing fields.
 *         '404':
 *           description: Not found. Cover letter with the given ID does not exist.
 *         '500':
 *           description: Internal server error.
 */

router.route("/getCoverLetterById/:id").get(async (req, res) => {
  const cover_id = req.params.id;
  const response = await getCoverLetterById(cover_id);
  return res.status(200).json(response);
});

export default router;
