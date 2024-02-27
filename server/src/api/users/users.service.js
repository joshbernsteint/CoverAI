import { z } from "zod";
import { users } from "../../config/mongoCollections.js";
import { UnexpectedError } from "../../utils/errors.js";

const userSchema = z.object({
  uuid: z.string().uuid(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const signUp = async (user) => {
  const validatedData = userSchema.parse(user);
  const { uuid, firstName, lastName } = validatedData;
  const usersCollection = await users();
  const newUser = {
    _id: uuid,
    firstName,
    lastName,
    // Settings would go somewhere here
  };
  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw new UnexpectedError();
  return "User signed up successfully";
};

export { signUp };
