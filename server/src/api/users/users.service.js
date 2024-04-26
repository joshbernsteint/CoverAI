import { ObjectId } from "mongodb";
import { users } from "../../config/mongoCollections.js";
import { UnexpectedError, BadRequestError } from "../../utils/errors.js";
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
  return user ? user.settings : {};
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

const getUser = async (user_id) => {
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  return user;
};

const setName = async (user_id, firstName, lastName) => {
  if (!firstName || !lastName)
    throw new UnexpectedError("First name and last name are required.");
  if (typeof firstName !== "string" || typeof lastName !== "string")
    throw new UnexpectedError("First name and last name must be strings.");
  if (firstName.trim().length === 0 || lastName.trim().length === 0)
    throw new UnexpectedError("First name and last name must not be empty.");

  firstName = firstName.trim();
  lastName = lastName.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  if (!user) throw new UnexpectedError("User not found.");

  let changes = 0;
  let toBeUpdated = {};
  if (!user.first_name || firstName !== user.first_name) {
    toBeUpdated.first_name = firstName;
    changes++;
  }
  if (lastName !== user.last_name) {
    toBeUpdated.last_name = lastName;
    changes++;
  }

  if (changes === 0) throw new UnexpectedError("No changes detected.");

  // only set the first name and last name
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: toBeUpdated }
  );

  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to update user name.");
  const updatedUser = await userCollection.findOne({
    _id: user_id,
  });

  return updatedUser;
};

const updateProfile = async (
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
) => {
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !schoolName ||
    !major ||
    !graduationDate ||
    !skills ||
    !description
  )
    throw new BadRequestError("All fields are required.");
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof email !== "string" ||
    typeof phoneNumber !== "string" ||
    typeof schoolName !== "string" ||
    typeof major !== "string" ||
    typeof graduationDate !== "string" ||
    !Array.isArray(skills) ||
    typeof description !== "string"
  )
    throw new BadRequestError("Invalid input.");
  if (
    firstName.trim().length === 0 ||
    lastName.trim().length === 0 ||
    email.trim().length === 0 ||
    phoneNumber.trim().length === 0 ||
    schoolName.trim().length === 0 ||
    major.trim().length === 0 ||
    graduationDate.trim().length === 0 ||
    skills.length === 0 ||
    description.trim().length === 0
  )
    throw new BadRequestError("All fields must not be empty.");

  firstName = firstName.trim();
  lastName = lastName.trim();
  email = email.trim();
  phoneNumber = phoneNumber.trim();
  schoolName = schoolName.trim();
  major = major.trim();
  graduationDate = graduationDate.trim();
  description = description.trim();

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: user_id });
  if (!user) throw new UnexpectedError("User not found.");

  let changes = 0;
  let toBeUpdated = user;
  if (!user.first_name || firstName !== user.first_name) {
    toBeUpdated.first_name = firstName;
    changes++;
  }
  if (lastName !== user.last_name) {
    toBeUpdated.last_name = lastName;
    changes++;
  }
  if (email !== user.email) {
    toBeUpdated.email = email;
    changes++;
  }
  if (phoneNumber !== user.phone_number) {
    toBeUpdated.phone_number = phoneNumber;
    changes++;
  }
  if (schoolName !== user.school_name) {
    toBeUpdated.school_name = schoolName;
    changes++;
  }
  if (major !== user.major) {
    toBeUpdated.major = major;
    changes++;
  }
  if (graduationDate !== user.graduation_date) {
    toBeUpdated.graduation_date = graduationDate;
    changes++;
  }
  if (JSON.stringify(skills) !== JSON.stringify(user.skills)) {
    toBeUpdated.skills = skills;
    changes++;
  }
  if (description !== user.description) {
    toBeUpdated.description = description;
    changes++;
  }
  if (changes === 0) throw new BadRequestError("No changes detected.");

  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $set: toBeUpdated }
  );
  if (updateResult.modifiedCount === 0)
    throw new UnexpectedError("Failed to update user profile.");
  const updatedUser = await userCollection.findOne({ _id: user_id });
  if (!updatedUser)
    throw new UnexpectedError("Failed to retrieve updated user profile.");

  return updatedUser;
};

export {
  setSkills,
  getSkills,
  setSettings,
  getSettings,
  resetSettings,
  setName,
  getUser,
  updateProfile,
};
