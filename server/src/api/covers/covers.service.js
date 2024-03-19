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

  const coversCollection = await covers();
  const lastThreeCoverLetters = await coversCollection
    .find({ user_id: user_id })
    .sort({ date: -1 })
    .limit(3)
    .toArray();

  let previousParagraphs = lastThreeCoverLetters
    .reduce((acc, coverLetter) => {
      if (coverLetter.paragraphs && coverLetter.paragraphs.length) {
        const paragraphs = coverLetter.paragraphs.slice(-3);
        acc.push(...paragraphs);
      }
      return acc;
    }, [])
    .join(" ");

  // If previousParagraphs is too long, you might need to trim it or use only the most recent set to keep the prompt within character limits for the API
  previousParagraphs = previousParagraphs.substring(0, 4000); // Example trim if necessary
  console.log(previousParagraphs);

  const promptContent = `Generate a cover letter for the position of ${job_title} at ${employer_name}, reflecting the tone and style of the applicant's previous letters. Previous content for reference: "${previousParagraphs}". The applicant's name is ${firstName} ${lastName}.`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format filling in this template: paragraphs: [greeting, first_paragraph, second_paragraph, third_paragraph, closing_statement, signature] where paragraphs is an array of strings. Ensure the new cover letter matches the tone of the previous cover letters if they are provided provided. Also make sure to incorporate any information from the users resume or previous cover letters.",
      },
      {
        role: "user",
        content: promptContent,
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

  const insertInfo = await coversCollection.insertOne({
    user_id,
    ...response,
  });
  if (insertInfo.insertedCount === 0) throw new UnexpectedError();

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
