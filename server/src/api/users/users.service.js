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
  const currentUser = await userCollection.findOne({ _id: user_id });
  if (JSON.stringify(currentUser.settings) === JSON.stringify(settings)) {
    return currentUser;
  }
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
        },
      },
    }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to reset user settings.");
  const updatedUser = await userCollection.findOne({ _id: user_id });
  return updatedUser;
};

const setName = async (user_id, firstName, lastName) => {
  if (!firstName || !lastName) throw new UnexpectedError("First name and last name are required.");
  if (typeof firstName !== "string" || typeof lastName !== "string") throw new UnexpectedError("First name and last name must be strings.");
  if (firstName.trim().length === 0 || lastName.trim().length === 0) throw new UnexpectedError("First name and last name must not be empty.");

  firstName = firstName.trim();
  lastName = lastName.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  if (!user) throw new UnexpectedError("User not found.");

  let changes = 0;
  let toBeUpdated = {};
  if (firstName !== user.first_name) {
    toBeUpdated.first_name = firstName;
    changes++;
  };
  if (lastName !== user.last_name) {
    toBeUpdated.last_name = lastName;
    changes++;
  };

  if (changes === 0) throw new UnexpectedError("No changes detected.");

  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: toBeUpdated }
  );
  if (updateResult.modifiedCount === 0) throw new UnexpectedError("Failed to update user name.");
  const updatedUser = await userCollection.findOne({ _id: user_id });

  return updatedUser;

}

export { setSkills, getSkills, setSettings, getSettings, resetSettings, setName };
