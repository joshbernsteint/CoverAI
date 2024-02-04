import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const signUp = async (user) => {
  const validatedData = userSchema.parse(user);
  const { firstName, lastName } = validatedData;
};
