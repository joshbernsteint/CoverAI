import OpenAI from "openai";
import clerkClient from "@clerk/clerk-sdk-node";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const genCoverLetter = async (user_id, employer_name, job_title) => {
  const userlist = await clerkClient.users.getUserList();
  console.log(userlist);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Respond in JSON format with first_name, last_name, email, date, employer_name, greeting, first_paragraph, second_paragraph, third_paragraph, closing_statement, signature",
      },
      {
        role: "user",
        content: `I need a cover letter for ${job_title}. My employer's name is ${employer_name}. My name is John Doe.`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  const response = JSON.parse(completion.choices[0].message.content);
  console.log(response);
};

export { genCoverLetter };
