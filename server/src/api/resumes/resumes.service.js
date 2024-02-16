import { z } from "zod";
import { users, resumes } from "../../config/mongoCollections.js";
import dotenv from "dotenv";
import {
  ExpressError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UnprocessableEntityError,
  InvalidTokenError,
  UnexpectedError,
} from "../../utils/errors.js";
dotenv.config();

import PDFDocument from "pdfkit";
import * as fs from "fs";
import pdf2json from "pdf2json";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { decode } from "punycode";
// import path from "path";
// import pdf from "pdf-parse";

const resumeSchema = z.object({
  _id: z.string(),
  education: z.object({
    school: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    grade: z.string(),
    activities: z.string(),
    from: z.string(),
    to: z.string(),
    description: z.string(),
    courses: z.array(z.string()),
  }),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      location: z.string(),
      from: z.string(),
      to: z.string(),
      description: z.array(z.string()),
    })
  ),
  skills: z.object({
    category: z.array(z.string()),
  }),
  projects: z.object({
    title: z.string(),
    description: z.array(z.string()),
    link: z.string(),
    from: z.string(),
    to: z.string(),
  }),
  certifications: z.array(z.string()),
  awards: z.array(z.string()),
  publications: z.array(
    z.object({
      title: z.string(),
      publisher: z.string(),
      date: z.string(),
      description: z.string(),
    })
  ),
  languages: z.array(
    z.object({
      language: z.string(),
      level: z.string(),
    })
  ),
});

const createPDF = async (resume, pdfname) => {
  const {
    education,
    experience,
    skills,
    projects,
    certifications,
    awards,
    publications,
    languages,
  } = resume;

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(pdfname));

  doc.fontSize(25).text("Resume", {
    align: "center",
  });

  // Add education
  if (education) {
    doc.fontSize(11).text("Education", {
      underline: true,
    });

    doc.fontSize(10).text(`School: ${education.school}`);
    doc.fontSize(10).text(`Degree: ${education.degree}`);
    doc.fontSize(10).text(`Field of Study: ${education.fieldOfStudy}`);
    doc.fontSize(10).text(`Grade: ${education.grade}`);
    doc.fontSize(10).text(`Activities: ${education.activities}`);
    doc.fontSize(10).text(`From: ${education.from}`);
    doc.fontSize(10).text(`To: ${education.to}`);
    doc.fontSize(10).text(`Description: ${education.description}`);
    doc.fontSize(10).text(`Courses: ${education.courses.join(", ")}`);
  }

  // Add experience
  if (experience.length > 0) {
    doc.fontSize(11).text("Experience", {
      underline: true,
    });

    experience.forEach((exp) => {
      doc.fontSize(10).text(`Title: ${exp.title}`);
      doc.fontSize(10).text(`Company: ${exp.company}`);
      doc.fontSize(10).text(`Location: ${exp.location}`);
      doc.fontSize(10).text(`From: ${exp.from}`);
      doc.fontSize(10).text(`To: ${exp.to}`);
      doc.fontSize(10).text(`Description: ${exp.description.join(", ")}`);
    });
  }

  // Add skills
  if (skills.category.length > 0) {
    doc.fontSize(11).text("Skills", {
      underline: true,
    });

    doc.fontSize(10).text(`Category: ${skills.category.join(", ")}`);
  }

  // Add projects
  if (projects.length > 0) {
    doc.fontSize(11).text("Projects", {
      underline: true,
    });

    doc.fontSize(10).text(`Title: ${projects.title}`);
    doc.fontSize(10).text(`Description: ${projects.description.join(", ")}`);
    doc.fontSize(10).text(`Link: ${projects.link}`);
    doc.fontSize(10).text(`From: ${projects.from}`);
    doc.fontSize(10).text(`To: ${projects.to}`);
  }

  // Add certifications
  if (certifications.length > 0) {
    doc.fontSize(11).text("Certifications", {
      underline: true,
    });

    doc.fontSize(10).text(`${certifications.join(", ")}`);
  }

  // Add awards
  if (awards.length > 0) {
    doc.fontSize(11).text("Awards", {
      underline: true,
    });

    doc.fontSize(10).text(`${awards.join(", ")}`);
  }

  // Add publications

  if (publications.length > 0) {
    doc.fontSize(11).text("Publications", {
      underline: true,
    });
    publications.forEach((publication) => {
      doc.fontSize(10).text(`Title: ${publication.title}`);
      doc.fontSize(10).text(`Publisher: ${publication.publisher}`);
      doc.fontSize(10).text(`Date: ${publication.date}`);
      doc.fontSize(10).text(`Description: ${publication.description}`);
    });
  }

  // Add languages
  if (languages.length > 0) {
    doc.fontSize(11).text("Languages", {
      underline: true,
    });

    languages.forEach((language) => {
      doc.fontSize(10).text(`Language: ${language.language}`);
      doc.fontSize(10).text(`Level: ${language.level}`);
    });
  }

  doc.end();
};

// Function to extract a section based on a regular expression
function extractSection(text, regex) {
  const match = text.match(regex);
  return match ? match[0] : "Section not found.";
}

const parsePDF = async (resumepdf, id, callback) => {
  try {
    const dataBuffer = fs.readFileSync(resumepdf);
    const pdfParser = new pdf2json();
    let resumeText = "";

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error(errData.parserError);
      // callback(errData.parserError, null, null, null);
      // return;
    });
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const extractedText = pdfData.Pages.flatMap((page) =>
        page.Texts.map((text) => text.R[0].T)
      );
      resumeText = extractedText.join(" ");
      let normalizedText = decodeURIComponent(resumeText);
      // normalizedText = normalizedText.replace(/\s+/g, " ");
      const cleanedText = normalizedText.replace(/\s+/g, ' ');
      // console.log("Resume Text:", cleanedText);
      callback(null, resumepdf, cleanedText, id);
      return;
    });

    pdfParser.parseBuffer(dataBuffer);
  } catch (error) {
    // throw new UnexpectedError("Error parsing PDF");
    throw error;
  }
  return;
};

const createResumeFromJSON = async (resume, id) => {
  const validatedData = resumeSchema.parse(resume);
  const {
    education,
    experience,
    skills,
    projects,
    certifications,
    awards,
    publications,
    languages,
  } = validatedData;

  // Add your logic here
  if (id) {
    const user = await users().findOne({ _id: id });
    if (!user) {
      throw new NotFoundError("User not found");
    }
  } else {
    throw new BadRequestError("User id is required");
  }

  const resumeData = {
    _id: id,
    education,
    experience,
    skills,
    projects,
    certifications,
    awards,
    publications,
    languages,
  };

  createPDF(resumeData, "resume.pdf");

  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const insertInfo = await resumeCollection.insertOne(resumeData);
  if (insertInfo.insertedCount === 0) {
    throw new UnexpectedError("Error inserting resume");
  }

  return resumeData;
};

const createResumeFromPDF = async (resume, id) => {
  // Parse the resume
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const resumeFilePath = path.join(__dirname, resume);
  console.log("Resume File Path:", resumeFilePath);
  await parsePDF(resumeFilePath, id, resumeCallback);
};

async function resumeCallback(err, resume, extractedText, id) {
  // Add your logic here
  if (err) {
    throw new UnexpectedError("Error parsing PDF");
  }
  if (!id) {
    throw new BadRequestError("User id is required");
  }
  if (!resume) {
    throw new BadRequestError("Resume is required");
  }
  if (!extractedText) {
    throw new BadRequestError("Extracted text is required");
  }

  // Check that the user exists

  // console.log("Resume Callback:", resume, extractedText, id);

  // Add the resume to the database
  // const resumeCollection = await resumes();
  // if (!resumeCollection) {
  //   throw new UnexpectedError("Error getting resume collection");
  // }
  return resume;
}

export { createResumeFromJSON, createResumeFromPDF };
