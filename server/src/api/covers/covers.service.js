import OpenAI from "openai";
import { covers, users } from "../../config/mongoCollections.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import {
  UnexpectedError,
  NotFoundError,
  ExpressError,
} from "../../utils/errors.js";
import { ObjectId } from "mongodb";
import { getUser } from "../users/users.service.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const genLetter = async (
  user_id,
  company_name,
  job_title,
  useResume = false,
  resumeData = null,
  useScraper = false,
  scrapedData = null
) => {
  const user = await clerkClient.users.getUser(user_id);
  const nameData = await getUser(user_id);
  if (!user) {
    throw new NotFoundError("User not found");
  }
  const firstName = nameData.first_name;
  const lastName = nameData.last_name;

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

  previousParagraphs = previousParagraphs.substring(0, 4000); // Trimming for character limit, if necessary

  let additionalInfo = "";

  if (useResume && resumeData) {
    resumeData.extractedSections.forEach((section) => {
      additionalInfo += `${section.name} includes ${section.extracted}. `;
    });

    if (resumeData.pdfJSON) {
      const { education, experience } = resumeData.pdfJSON;
      if (education) {
        additionalInfo += `I graduated with a ${education.degree} in ${education.fieldOfStudy} from ${education.school}, achieving a GPA of ${education.gpa} on a ${education.scale} scale. `;
      }

      // Experience assuming experience is an array of experiences
      if (experience && experience.length) {
        additionalInfo += "My professional experiences include: ";
        experience.forEach((exp) => {
          additionalInfo += `${exp.role} at ${exp.company}, where I ${exp.description}. `;
        });
      }
    }
  }

  if (useScraper) {
    additionalInfo += `About the job: ${scrapedData}`;
  }

  const promptContent = `Generate a cover letter for the position of ${job_title} at ${company_name}, reflecting the tone and style of the applicant's previous letters. Previous content for reference: "${previousParagraphs}". ${additionalInfo}.`;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format filling in this template: paragraphs: [first_paragraph, second_paragraph, third_paragraph] where paragraphs is an array of strings. Ensure the new cover letter matches the tone of the previous cover letters if they are provided, but do not include a greeting in any og the paragraphs or a signature at the end. Also, make sure to incorporate any information from the user's resume or the job description if available.",
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

  if (Array.isArray(response.paragraphs)) {
    response.paragraphs.unshift(`Dear Hiring Team at ${company_name}`);
    response.paragraphs.push(`Sincerely, ${firstName} ${lastName}`);
  }

  response.date = date;
  response.company_name = company_name;

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
          "Respond in JSON format with first_name, last_name, email, date, company_name, greeting, first_paragraph, second_paragraph, third_paragraph, closing_statement, signature",
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
    _id: new ObjectId(cover_id),
  });
  return coverLetter;
};

const updateCoverLetter = async (cover_id, paragraphs) => {
  const coverCollection = await covers();
  const updateResult = await coverCollection.updateOne(
    { _id: new ObjectId(cover_id) },
    { $set: { paragraphs: paragraphs } }
  );
  if (updateResult.modifiedCount === 0)
    throw new Error("Failed to update cover letter.");
  const coverLetter = await coverCollection.findOne({
    _id: new ObjectId(cover_id),
  });
  return coverLetter;
};

const getAllCoverLettersFromUser = async (user_id) => {
  const coversCollection = await covers();
  const coverLetters = await coversCollection.find({ user_id }).toArray();
  return coverLetters;
};

export {
  genLetter,
  genBasicLetter,
  updateCoverLetter,
  getCoverLetterById,
  getAllCoverLettersFromUser,
};
