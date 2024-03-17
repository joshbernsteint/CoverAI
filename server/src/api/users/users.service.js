import { z } from "zod";
import { users } from "../../config/mongoCollections.js";
import { UnexpectedError } from "../../utils/errors.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const userSchema = z.object({
  uuid: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const signUp = async (user) => {
  const validatedData = userSchema.parse(user);
  const { uuid, firstName, lastName } = validatedData;
  const usersCollection = await users();
  const userExists = await usersCollection.findOne({ _id: uuid });
  if (!userExists) {
    const newUser = {
      _id: uuid,
      firstName, //Maybe we dont need
      lastName, //Maybe we dont need
      email: clerkClient.users.getUser(uuid).emailAddresses[0].emailAddress, //Maybe we dont need
      covers: [],
      // Settings would go somewhere here
    };
    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw new UnexpectedError();
    return "User signed up successfully";
  }
  return "User already exists";
};

export { signUp };
