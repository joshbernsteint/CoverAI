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
import * as PDFJS from "pdfjs-dist";

const resumeSchema = z.object({
  _id: z.string(),
  education: z.object({
    school: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    gpa: z.string(),
    scale: z.string(),
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
  skills: z.array(
    z.object({
      category: z.string(),
      values: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.array(z.string()),
      link: z.string(),
      from: z.string(),
      to: z.string(),
    })
  ),
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

// Function to extract a section based on a regular expression
function extractSection(text, regex) {
  const match = text.match(regex);
  return match ? match[0] : "Section not found.";
}

function extractAllSections(text) {
  const sectionStartPatterns = [
    {
      name: 'Education',
      pattern: /^education/i,
    },
    {
      name: 'Experience',
      pattern: /^experience|history/i,
    },
    {
      name: 'Projects',
      pattern: /^projects/i,
    },
    {
      name: 'Skills or Extracurriculars',
      pattern: /^skills|extracurriculars/i,
    },
    // {
    //   name: 'Contact Information',
    //   pattern: /^([A-Z]\s?)+[,.]?(\|)?[A-Z].*$/i,
    // },
    {
      name: 'Summary or Objective',
      pattern: /^summary|objective/i,
    },
    {
      name: 'Certifications',
      pattern: /^certifications/i,
    },
    {
      name: 'Awards or Honors',
      pattern: /^awards|honors/i,
    },
    {
      name: 'Publications',
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

  text.split('\n').forEach((line) => {
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

const createResumeFromPDF = async (resumepdf, id) => {
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
    return await resumeCallback(pages.error, null, null, id);
  } else {
    // return await resumeCallback(null, resumepdf, pages.data, id);
    pages = pages.data;
  }

  const modifiedText = pages[0].text.replace(/ {2}(?! )/g, '\n');

  let resumeData = {
    name: extractSection(modifiedText, /([a-zA-Z]+[a-zA-Z\s]+)/).split('\n')[0],
    email: extractSection(
      modifiedText,
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
    ),
    phone: extractSection(modifiedText, /\(?\d{3}\)?[\s-]?\d{3}[\s-]\d{4}/),
    content: modifiedText,
  };

  // console.log(resumeData);
  // console.log(resumeData);
  console.log(extractAllSections(modifiedText));
};

async function resumeCallback(err, resume, extractedText, id) {
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

  // ! Check that the user exists

  // console.log("Resume Callback:", resume, extractedText, id);

  // Add the resume to the database
  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const resumeData = {
    userId: id,
    resumeType: "pdf",
    resume,
    extractedText,
  };

  const insertInfo = await resumeCollection.insertOne(resumeData);
  if (insertInfo.insertedCount === 0) {
    throw new UnexpectedError("Error inserting resume");
  }

  resumeData._id = insertInfo.insertedId.toString();

  return resumeData;
}

async function getAllResumesById(userId) {
  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const allResumes = await resumeCollection.find({ userId: userId }).toArray();

  return allResumes;
}

async function getResumeById(id) {
  const resumeCollection = await resumes();
  if (!resumeCollection) {
    throw new UnexpectedError("Error getting resume collection");
  }

  const resume = await resumeCollection.findOne({ _id: id });
  if (!resume) {
    throw new NotFoundError("Resume not found");
  }

  return resume;
}

export {
  createResumeFromJSON,
  createResumeFromPDF,
  getAllResumesById,
  getResumeById,
};
