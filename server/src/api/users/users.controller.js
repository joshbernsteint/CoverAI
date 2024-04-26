import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as userService from "./users.service.js";
import { UnexpectedError } from "../../utils/errors.js";

const clerkAuth = ClerkExpressRequireAuth({
  authorizedParties: [
    process.env.CLIENT_URL,
    ,
    process.env.WCLIENT_URL,
    process.env.LOCALHOST_URL,
  ],
});

router
  .route("/skills")
  .get(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const skills = await userService.getSkills(user_id);
      res.json({ skills });
    } catch (err) {
      next(err);
    }
  })
  .post(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const { skills } = req.body;
      const updatedUser = await userService.setSkills(user_id, skills);
      res.json({ skills: updatedUser.skills });
    } catch (err) {
      next(err);
    }
  });

router
  .route("/settings")
  .get(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const settings = await userService.getSettings(user_id);
      res.json({ settings });
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  .post(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const { settings } = req.body;
      const updatedUser = await userService.setSettings(user_id, settings);
      res.json({ settings: updatedUser.settings });
    } catch (err) {
      console.log(err.toString());
      next(err);
    }
  })
  .delete(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const updatedUser = await userService.resetSettings(user_id);
      res.json({ settings: updatedUser.settings });
    } catch (err) {
      next(err);
    }
  });

router
  .route("/profile")
  .put(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        schoolName,
        major,
        graduationDate,
        skills,
        description,
      } = req.body;
      const updatedUser = await userService.updateProfile(
        user_id,
        firstName,
        lastName,
        email,
        phoneNumber,
        schoolName,
        major,
        graduationDate,
        skills,
        description
      );
      res.json({
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
      });
    } catch (err) {
      next(err);
    }
  })
  .get(clerkAuth, async function (req, res, next) {
    try {
      const user_id = req.auth.sessionClaims.sub;
      const userData = await userService.getUser(user_id);
      res.json(userData);
    } catch (error) {
      next(error);
    }
  });

router.route("/profile/set-name").put(clerkAuth, async function (req, res, next) {
  try {
    const user_id = req.auth.sessionClaims.sub;
    const { firstName, lastName } = req.body;
    const updatedUser = await userService.setName(user_id, firstName, lastName);
    res.json({
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
    });
  } catch (err) {
    next(err);
  }
});


export default router;
