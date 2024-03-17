import { z } from "zod";
import { users } from "../../config/mongoCollections.js";
import { UnexpectedError } from "../../utils/errors.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const userSchema = z.object({
  uuid: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const addSkills = async (user_id, skills) => {
  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: { skills } }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to add skills to user.");
  return "Skills added successfully.";
};

export { signUp };
