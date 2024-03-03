import OpenAI from "openai";
import { covers } from "../../config/mongoCollections.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const genCoverLetter = async (employer_name, job_title) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format with first_name, last_name, email, date, employer_name, greeting, a paragraph array with at least 3 paragraphs, closing_statement, signature",
      },
      {
        role: "user",
        content: `I need a cover letter for ${job_title}. My employer's name is ${employer_name}. My name is John Doe.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const response = JSON.parse(completion.choices[0].message.content);
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

const addLetterToDB = async (uuid, json) => {
  const coverCollection = await covers();
  const insertInfo = await coverCollection.insertOne({
    user_id: uuid,
    ...json,
  });
  if (insertInfo.insertedCount === 0) throw new UnexpectedError();
  return "Cover letter added to database successfully";
};

export { genCoverLetter, genBasicLetter };
