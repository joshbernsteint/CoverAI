import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const jsonResume = {
  name: "John Doe",
  email: "johndoe@example.com",
  phone: "234567890",
  education: {
    school: "University of Example",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    gpa: "3.8",
    scale: "4.0",
    from: { month: "September", year: "2016" },
    to: { month: "May", year: "2020" },
    activities: "President of Computer Science Club",
    description:
      "Studied computer science with a focus on software engineering.",
    courses: "Data Structures, Algorithms, Software Engineering",
  },
  experience: [
    {
      title: "Software Engineer Intern",
      company: "Tech Company XYZ",
      location: "San Francisco, CA",
      from: { month: "June", year: "2019" },
      to: { month: "August", year: "2019" },
      description:
        "Developed new features for the company's web application. Collaborated with team members to troubleshoot and debug issues.",
    },
    {
      title: "Software Developer",
      company: "Software Solutions Inc.",
      location: "New York, NY",
      from: { month: "January", year: "2021" },
      to: "Present",
      description:
        "Designed and implemented backend services for a large-scale e-commerce platform. Utilized agile methodologies for project management.",
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      values: ["JavaScript", "Python", "Java"],
    },
    {
      category: "Frameworks",
      values: ["React", "Node.js", "Django"],
    },
  ],
  projects: [
    {
      title: "Online Marketplace",
      description:
        "Developed a full-stack web application for buying and selling products online. Implemented user authentication and authorization using JWT tokens.",
      link: "https://example.com/marketplace",
      from: { month: "March", year: "2020" },
    },
    {
      title: "Chat Application",
      description:
        "Created a real-time chat application using WebSocket technology. Implemented features such as private messaging and chat rooms.",
      from: { month: "July", year: "2021" },
    },
  ],
  certifications: ["AWS Certified Solutions Architect - Associate"],
  awards: ["Dean's List", "Outstanding Computer Science Student Award"],
  publications: [
    {
      title: "Introduction to Web Development",
      publisher: "Tech Publications",
      date: "June 2019",
      description:
        "A beginner's guide to web development covering HTML, CSS, and JavaScript.",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Intermediate" },
  ],
};

export const pdfResumePath = path.join(
  __dirname,
  "../public/examples/JoshuaGorman_Resume2024a.pdf"
);

export const jsonResumeUpdated = {
  name: "Joshua Gorman",
  email: "johndoe@example.com",
  phone: "234567890",
  education: {
    school: "University of Example",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    gpa: "3.8",
    scale: "4.0",
    from: { month: "September", year: "2016" },
    to: { month: "May", year: "2020" },
    activities: "President of Computer Science Club",
    description:
      "Studied computer science with a focus on software engineering.",
    courses: "Data Structures, Algorithms, Software Engineering",
  },
  experience: [
    {
      title: "Software Engineer Intern",
      company: "Tech Company XYZ",
      location: "San Francisco, CA",
      from: { month: "June", year: "2019" },
      to: { month: "August", year: "2019" },
      description:
        "Developed new features for the company's web application. Collaborated with team members to troubleshoot and debug issues.",
    },
    {
      title: "Software Developer",
      company: "Software Solutions Inc.",
      location: "New York, NY",
      from: { month: "January", year: "2021" },
      to: "Present",
      description:
        "Designed and implemented backend services for a large-scale e-commerce platform. Utilized agile methodologies for project management.",
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      values: ["JavaScript", "Python", "Java"],
    },
    {
      category: "Frameworks",
      values: ["React", "Node.js", "Django"],
    },
  ],
  projects: [
    {
      title: "Online Marketplace",
      description:
        "Developed a full-stack web application for buying and selling products online. Implemented user authentication and authorization using JWT tokens.",
      link: "https://example.com/marketplace",
      from: { month: "March", year: "2020" },
    },
    {
      title: "Chat Application",
      description:
        "Created a real-time chat application using WebSocket technology. Implemented features such as private messaging and chat rooms.",
      from: { month: "July", year: "2021" },
    },
  ],
  certifications: ["AWS Certified Solutions Architect - Associate"],
  awards: ["Dean's List", "Outstanding Computer Science Student Award"],
  publications: [
    {
      title: "Introduction to Web Development",
      publisher: "Tech Publications",
      date: "June 2019",
      description:
        "A beginner's guide to web development covering HTML, CSS, and JavaScript.",
    },
  ],
  languages: [
    { language: "English", level: "Native" },
    { language: "Spanish", level: "Intermediate" },
  ],
};
