import { users } from "../../config/mongoCollections.js";
import { UnexpectedError } from "../../utils/errors.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const getSkills = async (user_id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  return user.skills;
};

const setSkills = async (user_id, skills) => {
  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: { skills } }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to edit user skills.");
  const updatedUser = await userCollection.findOne({ _id: user_id });
  return updatedUser;
};

const getSettings = async (user_id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  return user.settings;
};

const setSettings = async (user_id, settings) => {
  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: { settings } }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to edit user settings.");
  const updatedUser = await userCollection.findOne({ _id: user_id });
  return updatedUser;
};

const resetSettings = async (user_id) => {
  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    {
      $set: {
        settings: {
          dark_mode: false,
          suggest_cl: false,
          auto_download_cl: false,
          save_resumes: false,
          save_cl: false,
        },
      },
    }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to reset user settings.");
  const updatedUser = await userCollection.findOne({ _id: user_id });
  return updatedUser;
};

export { setSkills, getSkills, setSettings, getSettings, resetSettings };
