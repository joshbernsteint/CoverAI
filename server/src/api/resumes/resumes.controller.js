import { Router } from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import * as resumeService from "./resumes.service.js";
import { UnexpectedError } from "../../utils/errors.js";

/**
 * @swagger
 * components:
 *  schemas:  
 *   ResumeManual:
 *    type: object
 *    properties:
 *      _id:
 *      type: string
 *      education:
 *        type: object
 *        properties:
 *          school:  
 *            type: string
 *            description: School name
 *          degree:
 *            type: string
 *            description: Degree pursued
 *         fieldOfStudy:
 *           type: string
 *           description: Field of Study
 * 
 * 
 **/