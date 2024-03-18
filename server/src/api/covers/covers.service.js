import OpenAI from "openai";
import { covers, users } from "../../config/mongoCollections.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { UnexpectedError } from "../../utils/errors.js";
import { ObjectId } from "mongodb";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const genCoverLetter = async (user_id, employer_name, job_title) => {
  const user = await clerkClient.users.getUser(user_id);
  const firstName = user.firstName;
  const lastName = user.lastName;
  const email = user.emailAddresses[0].emailAddress;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format with a paragraphs array that contains a greeting, least 3 body paragraphs, and a closing_statement. And lastly I want a signature. It should follow this format: paragraph: [greeting, first_paragraph, second_paragraph, third_paragraph, closing_statement, signature]",
      },
      {
        role: "user",
        content: `I need a cover letter for ${job_title}. My employer's name is ${employer_name}. My name is ${firstName} ${lastName}`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const response = JSON.parse(completion.choices[0].message.content);
  const date = new Date().toISOString().split("T")[0];
  response.date = date;
  response.first_name = firstName;
  response.last_name = lastName;
  response.email = email;
  response.employer_name = employer_name;
  const coversCollection = await covers();
  const insertInfo = await coversCollection.insertOne({
    user_id,
    ...response,
  });
  if (insertInfo.insertedCount === 0) throw new UnexpectedError();
  const cover_id = insertInfo.insertedId.toString();
  const userCollection = await users();
  const updateResult = await userCollection.updateOne(
    { _id: user_id },
    { $push: { covers: cover_id } }
  );

  if (updateResult.modifiedCount === 0)
    throw new Error("Failed to update user with cover letter ID.");
  return response;
};

const genBasicLetter = async (description) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format with first_name, last_name, email, date, employer_name, greeting, first_paragraph, second_paragraph, third_paragraph, closing_statement, signature",
      },
      {
        role: "user",
        content: description,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const response = JSON.parse(completion.choices[0].message.content);
  return response;
};

const getCoverLetterById = async (cover_id) => {
  const coversCollection = await covers();
  const coverLetter = await coversCollection.findOne({
    _id: ObjectId(cover_id),
  });
  return coverLetter;
};

const updateCoverLetter = async (cover_id, paragraphs) => {
  const coverCollection = await covers();
  const updateResult = await coverCollection.updateOne(
    { _id: ObjectId(cover_id) },
    { $set: { paragraphs: paragraphs } }
  );
  if (updateResult.modifiedCount === 0)
    throw new Error("Failed to update cover letter.");
  const coverLetter = await coverCollection.findOne({
    _id: ObjectId(cover_id),
  });
  return coverLetter;
};

const getAllCoverLettersFromUser = async (user_id) => {
  const coversCollection = await covers();
  const coverLetters = await coversCollection.find({ user_id }).toArray();
  return coverLetters;
};

export {
  genCoverLetter,
  genBasicLetter,
  updateCoverLetter,
  getCoverLetterById,
  getAllCoverLettersFromUser,
};
