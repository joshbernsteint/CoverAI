import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  genCoverLetter,
  genBasicLetter,
  getCoverLetterById,
  updateCoverLetter,
  getAllCoverLettersFromUser,
} from "./covers.service.js";

/**
 * @swagger
 * paths:
 *   /covers/genCoverLetter:
 *     post:
 *       summary: Generates a custom cover letter
 *       description: >
 *         This endpoint takes employer name and job title from the request body to generate a personalized cover letter for the user.
 *       operationId: genCoverLetter
 *       tags:
 *         - Cover Letters
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - employer_name
 *                 - job_title
 *               properties:
 *                 employer_name:
 *                   type: string
 *                   description: The name of the employer or the company to which the cover letter is addressed.
 *                 job_title:
 *                   type: string
 *                   description: The title of the job position for which the cover letter is being generated.
 *             example:
 *               employer_name: "Acme Corp"
 *               job_title: "Software Engineer"
 *       responses:
 *         '200':
 *           description: Successfully generated cover letter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: ObjectId
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
 *                     description: An array containing the paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   _id: ObjectID('623d6e9d9e2b6f001f2f5c7d')
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
 *         '500':
 *           description: Internal server error.
 */

router.route("/genCoverLetter").post(
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL],
  }),
  async (req, res, next) => {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const employer_name = req.body.employer_name;
      const job_title = req.body.job_title;
      const response = await genCoverLetter(user_id, employer_name, job_title);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

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
 *   /getAllCoverLetters:
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
 *   /covers/getCoverLetterById:
 *     get:
 *       summary: Retrieves a specific cover letter by ID
 *       description: >
 *         This endpoint fetches a specific cover letter using its unique identifier.
 *       operationId: getCoverLetterById
 *       tags:
 *         - Cover Letters
 *       parameters:
 *         - in: query
 *           name: cover_id
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
 *                     type: ObjectId
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
 *                     description: An array containing the paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   _id: ObjectID('623d6e9d9e2b6f001f2f5c7d')
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

router.route("/getCoverLetterById").get(async (req, res) => {
  const cover_id = req.cover_id;
  const response = await getCoverLetterById(cover_id);
  return res.status(200).json(response);
});

export default router;
