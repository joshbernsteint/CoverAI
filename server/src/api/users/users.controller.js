import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as userService from "./users.service.js";
import { UnexpectedError } from "../../utils/errors.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier for the user.
 *         firstName:
 *           type: string
 *           description: First name of the user.
 *         lastName:
 *           type: string
 *           description: Last name of the user.
 *       example:
 *         id: user_2bSO2FvIlVSIAXMUOGr5v1fCGIG
 *         firstName: John
 *         lastName: Doe
 */

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: User Signup
 *     description: Allows users to sign up.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user.
 *               lastName:
 *                 type: string
 *                 description: Last name of the user.
 *           example:
 *             firstName: John
 *             lastName: Doe
 *     responses:
 *       200:
 *         description: User signed up successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User signed up successfully
 *       401:
 *         description: Unauthorized - Invalid or missing authentication session.
 *       500:
 *         description: Internal Server Error
 */

router.route("/signup").post(
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_IP],
  }),
  async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      await userService.signUp({
        uuid: req.auth.sessionClaims.sub,
        firstName,
        lastName,
      });
      res.status(200).send("User signed up successfully");
    } catch (error) {
      console.error(error);
      throw new UnexpectedError();
    }
  }
);

export default router;
