import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as userService from "./users.service.js";
import { UnexpectedError } from "../../utils/errors.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
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
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: User signed up successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User signed up successfully
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       500:
 *         description: Internal Server Error
 */

router.route("/signup").post(
  ClerkExpressRequireAuth({
    authorizedParties: [process.env.CLIENT_URL],
  }),
  async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      const response = await userService.signUp({
        uuid: req.auth.sessionClaims.sub,
        firstName,
        lastName,
      });
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
);

export default router;
