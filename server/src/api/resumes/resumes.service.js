import { z } from "zod";
import { ObjectId } from "mongodb";
import OpenAI from "openai";
import { resumes } from "../../config/mongoCollections.js";
import dotenv from "dotenv";
import {
  BadRequestError,
  NotFoundError,
  UnprocessableEntityError,
  UnexpectedError,
} from "../../utils/errors.js";
dotenv.config();

import PDFDocument from "pdfkit";
import * as fs from "fs";
import * as PDFJS from "pdfjs-dist";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const resumeSchema = z.object({
  // _id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  education: z
    .object({
      school: z.string(),
      degree: z.string(),
      fieldOfStudy: z.string(),
      gpa: z.string(),
      scale: z.string(),
      awards: z.string().optional(),
      activities: z.string().optional(),
      from: z
        .object({
          month: z.string(),
          year: z.string(),
        })
        .optional(),
      to: z.object({
        month: z.string(),
        year: z.string(),
      }),
      description: z.string().optional(),
      courses: z.string().optional(),
    })
    .optional(),
  experience: z.array(
    z
      .object({
        title: z.string(),
        company: z.string(),
        location: z.string(),
        from: z.object({
          month: z.string(),
          year: z.string(),
        }),
        to: z
          .object({
            month: z.string(),
            year: z.string(),
          })
          .or(z.string()),
        description: z.string(),
      })
      .optional()
  ),
  skills: z.array(
    z
      .object({
        category: z.string(),
        values: z.array(z.string()),
      })
      .or(z.array(z.string()))
      .optional()
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      link: z.string().optional(),
      from: z
        .object({
          month: z.string(),
          year: z.string(),
        })
        .optional(),
      to: z
        .object({
          month: z.string(),
          year: z.string(),
        })
        .or(z.string())
        .optional(),
    })
  ),
  certifications: z.array(z.string()).optional(),
  awards: z.array(z.string()).optional(),
  publications: z
    .array(
      z.object({
        title: z.string(),
        publisher: z.string(),
        date: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string().optional(),
      })
    )
    .optional(),
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

const uploadToDatabase = async (resumeData) => {
  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const insertInfo = await resumeCollection.insertOne(resumeData);
  if (insertInfo.insertedCount === 0) {
    throw new UnexpectedError("Error inserting resume");
  }

  resumeData._id = insertInfo.insertedId.toString();

  return resumeData;
};

/**
 * Create a resume from a JSON object.
 * @param {Object} resume - The resume data.
 * @param {string} id - The ID of the user to create the resume for.
 * @param {boolean} upload - Whether to upload the resume to the database.
 * @returns - The resume data.
 * @throws {UnprocessableEntityError} - If the resume data is invalid.
 * @throws {BadRequestError} - If the user ID is not provided.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example createResumeFromJSON(resume, "60f2c4d9b8b3f6e1d8b1e1f3");
 */
const createResumeFromJSON = async (resume, id, upload = true) => {
  if (!id) {
    throw new BadRequestError("User id is required");
  }
  let validatedData;
  try {
    validatedData = resumeSchema.parse(resume);
  } catch (error) {
    throw new UnprocessableEntityError(error.errors);
  }

  const {
    name,
    email,
    phone,
    education,
    experience,
    skills,
    projects,
    certifications,
    awards,
    publications,
    languages,
  } = validatedData;

  let resumeData = {
    userId: id,
    resumeType: "json",
    extractedText: "",
    extractedSections: [],
    pdfJSON: {
      name: name || "",
      email: email || "",
      phone: phone || "",
      education: education || {},
      experience: experience || {},
      skills: skills || [],
      projects: projects || [],
      certifications: certifications || [],
      awards: awards || [],
      publications: publications || [],
      languages: languages || [],
    },
  };

  // createPDF(resumeData, "resume.pdf"); // Create PDF from resume data

  let extractText = (pdfJson) => {
    let text = "";
    if (Array.isArray(pdfJson)) {
      pdfJson.forEach((item, index) => {
        if (typeof item === "string") {
          text += item + ", ";
          if (index === pdfJson.length - 1) {
            text = text.slice(0, -2) + "\n";
          }
        } else {
          text += extractText(item);
          if (index === pdfJson.length - 1) {
            text = text.slice(0, -2) + "\n";
          }
        }
      });
    } else if (typeof pdfJson === "object") {
      for (const [key, value] of Object.entries(pdfJson)) {
        if (Array.isArray(value)) {
          text += key + "\n";
          text += extractText(value);
        } else if (typeof value === "object") {
          text += key + "\n";
          text += extractText(value);
        } else {
          text += value + ", ";
        }
      }
    }
    return text;
  };

  let getText = (resumeData) => {
    let text = "";

    text += extractText(resumeData.pdfJSON);

    return text;
  };

  resumeData.extractedText = getText(resumeData);

  // Get all the sections from the text
  resumeData.extractedSections = extractAllSections(resumeData.extractedText);

  if (upload) {
    return await uploadToDatabase(resumeData);
  } else {
    return resumeData;
  }
};

/**
 * Extracts a section from a string of text using a regular expression.
 * @param {string} text - The text to extract the section from.
 * @param {RegExp} regex - The regular expression to use to extract the section.
 * @returns {string} - The extracted section.
 * @throws {Error} - If the section is not found.
 * @example extractSection("Hello, World!", /Hello/); // "Hello"
 * @example extractSection("Hello, World!", /Goodbye/); // Error: Section not found.
 */
function extractSection(text, regex) {
  const match = text.match(regex);
  return match ? match[0] : "Section not found.";
}

/**
 * Extracts all the sections from a string of text.
 * @param {string} text - The text to extract the sections from.
 * @returns {Array} - An array of objects containing the name of the section and the content of the section.
 * @example extractAllSections("Hello, World!"); // [{ name: "Hello", content: "Hello, World!" }]
 * @example extractAllSections("Hello, World!"); // [{ name: "Hello", content: "Hello, World!" }]
 */
function extractAllSections(text) {
  const sectionStartPatterns = [
    {
      name: "Education",
      pattern: /^education/i,
    },
    {
      name: "Experience",
      pattern: /^experience|history/i,
    },
    {
      name: "Projects",
      pattern: /^projects/i,
    },
    {
      name: "Skills or Extracurriculars",
      pattern: /^skills|extracurriculars/i,
    },
    // {
    //   name: 'Contact Information',
    //   pattern: /^([A-Z]\s?)+[,.]?(\|)?[A-Z].*$/i,
    // },
    {
      name: "Summary or Objective",
      pattern: /^summary|objective/i,
    },
    {
      name: "Certifications",
      pattern: /^certifications/i,
    },
    {
      name: "Awards or Honors",
      pattern: /^awards|honors/i,
    },
    {
      name: "Publications",
      pattern: /^publications/i,
    },
    // {
    //   name: 'Languages',
    //   pattern: /^languages/i,
    // },
    // {
    //   name: 'Hobbies or Interests',
    //   pattern: /^hobbies/i,
    // },
  ];

  const sections = [];

  text.split("\n").forEach((line) => {
    const sectionStartPattern = sectionStartPatterns.find((pattern) =>
      line.toLowerCase().match(pattern.pattern)
    );
    if (sectionStartPattern) {
      sections.push({
        name: sectionStartPattern.name,
        content: line,
      });
    }
  });

  // get all the content between the sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const nextSection = sections[i + 1];
    const startIndex = text.indexOf(section.content) + section.content.length;
    const endIndex = nextSection
      ? text.indexOf(nextSection.content)
      : text.length;
    const content = text.slice(startIndex, endIndex).trim();
    sections[i].extracted = content;
  }

  return sections;
}

function parseEducation(extracted) {
  // Define regex patterns for various fields
  const universityPattern = /(.+)\s*?(\n|$)/;
  const locationPattern = /\n(.+?)\n/;
  let degreePattern =
    /(?:Bachelor|Master|Bachelors|Masters)\s+(?:in|of)\s+(.*?)(?:\n)/;
  const graduationPattern = /(?:Expected|Graduated)\s*(.*?)\s*?(\n|$)/;
  const gpaPattern =
    /(?:Cumulative GPA|GPA): ([\d.]+)\/([\d.]+);\s*(.*?)\s*?(\n|$)/;
  const courseworkPattern = /Relevant Coursework\s*:\s*([\s\S]*)/;

  // Extract details using regex
  const universityMatch = extracted.match(universityPattern);
  const locationMatch = extracted.match(locationPattern);
  let degreeMatch = extracted.match(degreePattern);
  if (!degreeMatch) {
    degreePattern = /(?:BS|BA|MS|MBA|MA|Phd)\s+(.*?)(?:\n|$)/;
    degreeMatch = extracted.match(degreePattern);
  }
  const graduationMatch = extracted.match(graduationPattern);
  const gpaMatch = extracted.match(gpaPattern);
  const courseworkMatch = extracted.match(courseworkPattern);

  let major = "";
  if (degreeMatch) {
    if (degreeMatch[1].includes(",")) {
      major = degreeMatch[1].split(",")[1].trim();
      degreeMatch[0] = degreeMatch[0].split(",")[0].trim();
    } else if (degreeMatch[1].includes(" in ")) {
      major = degreeMatch[1].split(" in ")[1].trim();
      degreeMatch[0] = degreeMatch[0].split(" in ")[0].trim();
    } else if (degreeMatch[1].includes(":")) {
      major = degreeMatch[1].split(":")[1].trim();
      degreeMatch[0] = degreeMatch[0].split(":")[0].trim();
    } else if (degreeMatch[1].includes(" of ")) {
      major = degreeMatch[1].split(" of ")[1].trim();
      degreeMatch[0] = degreeMatch[0].split(" of ")[0].trim();
    } else {
      major = degreeMatch[1].trim();
    }
  }

  // Create JSON object
  const educationJSON = {
    school: universityMatch ? universityMatch[1].trim() : "",
    location: locationMatch ? locationMatch[1].trim() : "",
    degree: degreeMatch ? degreeMatch[0].trim() : "",
    fieldOfStudy: major,
    to: graduationMatch ? graduationMatch[1].trim() : "",
    gpa: gpaMatch ? gpaMatch[1].trim() : "",
    scale: gpaMatch
      ? !isNaN(gpaMatch[2].trim())
        ? gpaMatch[2].trim()
        : "4.0"
      : "4.0",
    awards: gpaMatch ? gpaMatch[3].trim() : "",
    courses: courseworkMatch ? courseworkMatch[1].trim() : "",
  };

  let splitTo = educationJSON.to.split(" ");

  educationJSON.to = {
    month: splitTo[0].trim(),
    year: splitTo[1].trim(),
  };

  return educationJSON;
}

function parseExperiance(extracted) {
  const experiences = [];

  return experiences;
}

/**
 * Create a resume from a PDF.
 * @param {Buffer} resumepdf - The resume in PDF format.
 * @param {string} id - The ID of the user to create the resume for.
 * @param {string} filename - The name of the PDF file.
 * @param {boolean} upload - (Optional) Whether to upload the resume to the database.
 * @returns - The resume data.
 * @throws {BadRequestError} - If the user ID is not provided.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example createResumeFromPDF(resumepdf, "60f2c4d9b8b3f6e1d8b1e1f3", "resume.pdf");
 */
const createResumeFromPDF = async (
  resumepdf,
  id,
  filename = "resume.pdf",
  upload = true
) => {
  if (!id) {
    throw new BadRequestError("User id is required");
  }
  if (!resumepdf) {
    throw new BadRequestError("Resume is required");
  }
  id = id.trim();

  const dataBuffer = resumepdf.buffer;

  let pages = await PDFJS.getDocument({ data: new Uint8Array(dataBuffer) })
    .promise.then(async (pdf) => {
      let allPages = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        await pdf.getPage(i).then(async (page) => {
          await page.getTextContent().then(async (textContent) => {
            const text = textContent.items.map((item) => item.str).join(" ");
            allPages.push({ page: i, text });
          });
        });
      }
      return { data: allPages };
    })
    .catch((err) => {
      console.log(err);
      return { error: err };
    });

  if (pages.error) {
    throw new UnexpectedError("Error parsing PDF");
  } else {
    pages = pages.data;
  }

  let modifiedText = pages[0].text.replace(/ {2}(?! )/g, "\n");

  // remove null character from text
  modifiedText = modifiedText.replace(/\0/g, "");

  let resumeData = {
    userId: id,
    resumeType: "pdf",
    pdfName: filename,
    extractedText: pages[0].text,
    extractedSections: extractAllSections(modifiedText),
    pdfJSON: {
      name: extractSection(modifiedText, /([a-zA-Z]+[a-zA-Z\s]+)/).split(
        "\n"
      )[0],
      email: extractSection(
        modifiedText,
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      ),
      phone: extractSection(modifiedText, /\(?\d{3}\)?[\s-]?\d{3}[\s-]\d{4}/),
    },
  };

  for (const section of resumeData.extractedSections) {
    if (section.name.toLowerCase().includes("education")) {
      resumeData.pdfJSON.education = parseEducation(section.extracted);
    } else if (section.name.toLowerCase().includes("experience")) {
      resumeData.pdfJSON.experience = parseExperiance(section.extracted);
    }
  }
  if (upload) {
    return await uploadToDatabase(resumeData);
  } else {
    return resumeData;
  }
};

/**
 * Get all resumes by user ID.
 * @param {string} userId - The ID of the user to get resumes for.
 * @returns {Array} - An array of resumes for the user.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example getAllResumesById("60f2c4d9b8b3f6e1d8b1e1f3");
 */
const getAllResumesById = async (userId) => {
  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }
  const allResumes = await resumeCollection.find({ userId: userId }).toArray();

  return allResumes;
};

/**
 * Get a resume by its ID.
 * @param {*} id - The ID of the resume to get.
 * @returns - The resume with the given ID.
 * @throws {NotFoundError} - If the resume is not found.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example getResumeById("60f2c4d9b8b3f6e1d8b1e1f3");
 */
const getResumeById = async (id) => {
  if (!id) {
    throw new BadRequestError("Resume ID is required");
  }

  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const resume = await resumeCollection.findOne({ _id: new ObjectId(id) });
  if (!resume) {
    throw new NotFoundError("Resume not found");
  }

  return resume;
};

/**
 * Update a resume by its ID.
 * @param {*} id - The ID of the resume to update.
 * @param {*} resume - The updated resume data.
 * @param {*} type - The type of the resume (e.g., "json" or "pdf").
 * @param {*} userId - The ID of the user who owns the resume.
 * @param {*} filename - (Optional) The name of the PDF file.
 * @returns - The updated resume.
 * @throws {BadRequestError} - If the resume ID is not provided.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example updateResumeById("60f2c4d9b8b3f6e1d8b1e1f3", updatedResume);
 */
const updateResumeById = async (id, resume, type, userId, filename = "") => {
  if (!id) {
    throw new BadRequestError("Resume ID is required");
  }
  if (!userId) {
    throw new BadRequestError("User ID is required");
  }
  if (!type) {
    throw new BadRequestError("Resume type is required");
  }

  var updatedResumeData = {};

  if (type === "json") {
    updatedResumeData = await createResumeFromJSON(resume, userId, false);
  } else if (type === "pdf") {
    updatedResumeData = await createResumeFromPDF(
      resume,
      userId,
      filename,
      false
    );
  } else {
    throw new BadRequestError("Invalid resume type");
  }

  let resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  let updatedResume = await resumeCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedResumeData }
  );
  if (!updatedResume) {
    throw new UnexpectedError("Error updating resume");
  }
  if (updatedResume.modifiedCount === 0) {
    throw new UnexpectedError("Error updating resume");
  }

  updatedResumeData._id = id;
  return updatedResumeData;
};

/**
 * Remove a resume by its ID.
 * @param {*} id - The ID of the resume to remove.
 * @returns - The deleted resume.
 * @throws {BadRequestError} - If the resume ID is not provided.
 * @throws {UnexpectedError} - If an unexpected error occurs.
 * @example removeResumeById("60f2c4d9b8b3f6e1d8b1e1f3");
 */
const deleteResumeById = async (id) => {
  if (!id) {
    throw new BadRequestError("Resume ID is required");
  }

  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const deletedResume = await resumeCollection.deleteOne({
    _id: new ObjectId(id),
  });
  if (!deletedResume) {
    throw new UnexpectedError("Error deleting resume");
  }

  return deletedResume;
};

export {
  createResumeFromJSON,
  createResumeFromPDF,
  getAllResumesById,
  getResumeById,
  updateResumeById,
  deleteResumeById,
};
