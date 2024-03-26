import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as userService from "./users.service.js";
import { UnexpectedError } from "../../utils/errors.js";

router
  .route("/skills")
  .get(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async function (req, res, next) {
      try {
        const user_id = req.auth.sessionClaims.sub;
        const skills = await userService.getSkills(user_id);
        res.json({ skills });
      } catch (err) {
        next(err);
      }
    }
  )
  .post(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async function (req, res, next) {
      try {
        const user_id = req.auth.sessionClaims.sub;
        const { skills } = req.body;
        const updatedUser = await userService.setSkills(user_id, skills);
        res.json({ skills: updatedUser.skills });
      } catch (err) {
        next(err);
      }
    }
  );

router
  .route("/settings")
  .get(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async function (req, res, next) {
      try {
        const user_id = req.auth.sessionClaims.sub;
        const settings = await userService.getSettings(user_id);
        res.json({ settings });
      } catch (err) {
        console.error(err);
        next(err);
      }
    }
  )
  .post(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async function (req, res, next) {
      try {
        const user_id = req.auth.sessionClaims.sub;
        const { settings } = req.body;
        const updatedUser = await userService.setSettings(user_id, settings);
        res.json({ settings: updatedUser.settings });
      } catch (err) {
        next(err);
      }
    }
  )
  .delete(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async function (req, res, next) {
      try {
        const user_id = req.auth.sessionClaims.sub;
        const updatedUser = await userService.resetSettings(user_id);
        res.json({ settings: updatedUser.settings });
      } catch (err) {
        next(err);
      }
    }
  );

export default router;
