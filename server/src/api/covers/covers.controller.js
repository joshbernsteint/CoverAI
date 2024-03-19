import Router from "express";
const router = Router();
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import {
  genLetter,
  genBasicLetter,
  getCoverLetterById,
  updateCoverLetter,
  getAllCoverLettersFromUser,
} from "./covers.service.js";

/**
 * @swagger
 * /covers/genCoverLetter:
 *   post:
 *     summary: Generates a personalized cover letter for a user
 *     description: >-
 *       This endpoint accepts details about a job application and, optionally, the user's resume and scraped job data,
 *       to generate a personalized cover letter. The cover letter is tailored based on the user's previous cover letters,
 *       educational background, experiences, and the specifics of the job being applied for.
 *     tags:
 *       - Cover Letters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employer_name:
 *                 type: string
 *                 description: The name of the employer.
 *                 example: 'Acme Corp'
 *               job_title:
 *                 type: string
 *                 description: The title of the job position.
 *                 example: 'Software Engineer'
 *               useResume:
 *                 type: boolean
 *                 description: Flag indicating whether to use the user's resume data.
 *                 example: false
 *               resumeData:
 *                 type: object
 *                 description: >-
 *                   An object containing the user's resume data, including extracted sections and PDF JSON data.
 *                   This parameter is optional and only used if useResume is true.
 *               useScraper:
 *                 type: boolean
 *                 description: Flag indicating whether to use scraped job data.
 *                 example: true
 *               scrapedData:
 *                 type: string
 *                 description: >-
 *                   A string containing scraped data about the job. This parameter is optional and only used if useScraper is true.
 *                 example: 'Details about the job responsibilities and requirements.'
 *     responses:
 *       200:
 *         description: Cover letter generated successfully.
 *         content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The updated paragraphs of the cover letter.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *       400:
 *         description: Bad request. Invalid input or missing fields.
 *       401:
 *         description: Unauthorized. User is not authenticated.
 *       404:
 *         description: Not found. Cover letter with the given ID does not exist.
 *       500:
 *         description: Internal server error.
 */

router.route("/genCoverLetter").post(async (req, res, next) => {
  try {
    // const user_id = req.auth.sessionClaims.sub;
    const user_id = "user_2dC6mNNpMcxT5kubchWOsfUs2TB";
    resumeData = {
      _id: {
        $oid: "65f8ebc97b9b5caa9e6cce25",
      },
      userId: "65f74a1ef1a8f10d860bb03f",
      resumeType: "pdf",
      extractedText:
        "Joshua Bernstein  Mahwah, NJ, 07430   |   201-249-3266 | joshuatbernstein@gmail.com | joshbernsteint.github.io | LinkedIn  EDUCATION & LANGUAGES  Stevens Institute of Technology,   Hoboken, NJ—   Bachelors of Computer Science   (2021 – Spring 2024)  - 3.9 GPA, Stevens Pinnacle Scholar. Expected graduation date Spring 2024.  - Relevant coursework: Data structures–A, Systems Programming–A, Algorithms–A, Computer Architecture–A  Stevens Institute of Technology,   Hoboken, NJ—   Masters of Computer Science   (2024 – Spring 2025)  -Beginning Graduate Program Fall 2024. Graduating with my Bachelors and Masters of Computer Science in 4 years.  Languages  - Fluent English skills, including speaking, writing, and reading.  - Professional French Skills, including speaking, writing, and reading (Recipient of the NJDOE Seal of Biliteracy in French)  SKILLS  - Experience and expertise in a variety of di \u0000 erent programming languages including:  - Python, C/C++, Java, ARMv8 Assembly, Javascript, Racket, OCaml, R, C#, Bash  - Seasoned with Git and utilizing continuous integration tools such as GitHub Actions.  - Versed in utilizing cloud-based virtual machines via Secure Socket Shell(SSH) Protocol.  - Pro fi cient with database management systems and engines such as PostgresQL and MongoDB.  EXPERIENCE  Student Assistant—   Stevens Institute of Technology, Hoboken, NJ   (Oct 2023 – Present)  - Designed and programmed an interactive dashboard capable of viewing, editing, and analyzing speci fi c model data.  - Coordinated with 6 other team members to integrate their contributions into the dashboard e \u0000 ciently.  - Delivered periodic presentations and demonstrations to over 40 supervisors and project clients.  Course Assistant—   Stevens Institute of Technology, Hoboken, NJ   (Sept 2023 – Present)  - Re fi ned class assignments and homeworks to ensure a lack of typographical and logical errors.  - Taught weekly lab sessions to 35 students to cement their understanding in the curriculum.  - Streamlined the grading process by constructing a script to automatically grade homeworks for 200 students.  - Conducted weekly o \u0000 ce hours to answer any questions regarding the subject material.  Research Assistant –   Stevens Institute of Technology, Hoboken, NJ   (Summer 2022, Summer 2023)  - Spearheaded design and construction of Python scripts to download, analyze, and store over 690,000 image   fi les safely.  - Utilized aforementioned scripts to e \u0000 ectively   fi lter images to curate a sample of 3,600 high-quality image   fi les.  - Implemented scripts to interact with GIS software technologies such as ArcGIS to correlate geographic image metadata  with a 2D map of Mercury to visualize physical locations of each image   fi le.  - Coordinated with 4 colleagues in the research group to facilitate e \u0000 cient and standardized code.  PROJECTS  ANGEL   —   Node-based Downloader and Converter Application   (Summer 2023) – GitHub Repository  - Electron-based Node and React application to download and convert audio and video   fi les.  - Features ability to choose download quality, either through video resolution, audio quality, or frame rate.  - Utilizes   \u0000 mpeg for video and audio conversion from any supported container format to another.  - Editable settings including di \u0000 erent view modes, custom download preferences, and accessibility options.  Scrumptious Solar Services —   Full-stack Web Application   (Spring 2023) – GitHub Repository  - Directed a 6-person team in the production of a web application to streamline the processes of a solar panel company.  - Integrated several di \u0000 erent technologies, including React, Express, Stripe, and Firebase in the end-product.  - Implemented Agile development methodology over 4 two-week sprints, producing a workable demo each sprint.  - Recipient of “Outstanding Project Award” out of 35 total teams by the project client.  VOLUNTEER & EXTRACURRICULARS  Vice President —   Stevens Computer Science Club   (Fall 2023 – Present)  - Composed weekly newsletter to inform the over 300 club members of important events and opportunities.  - Ensured club meetings had a room reserved with adequate space for all members.  - Guided workshops and presentations on essential computer science topics.  AWARDS & ACCOLADES  - Stevens Institute of Technology Dean’s List– Fall 2021, Spring 2022, Fall 2022, Spring 2023  - Outstanding Project Award in recognition of work done on   Scrumptious Solar Services   – Spring 2023",
      extractedSections: [
        {
          name: "Education",
          content: "EDUCATION & LANGUAGES",
          extracted:
            "Stevens Institute of Technology, \nHoboken, NJ— \nBachelors of Computer Science \n(2021 – Spring 2024)\n- 3.9 GPA, Stevens Pinnacle Scholar. Expected graduation date Spring 2024.\n- Relevant coursework: Data structures–A, Systems Programming–A, Algorithms–A, Computer Architecture–A\nStevens Institute of Technology, \nHoboken, NJ— \nMasters of Computer Science \n(2024 – Spring 2025)\n-Beginning Graduate Program Fall 2024. Graduating with my Bachelors and Masters of Computer Science in 4 years.\nLanguages\n- Fluent English skills, including speaking, writing, and reading.\n- Professional French Skills, including speaking, writing, and reading (Recipient of the NJDOE Seal of Biliteracy in French)",
        },
        {
          name: "Skills or Extracurriculars",
          content: "SKILLS",
          extracted:
            "- Experience and expertise in a variety of di  erent programming languages including:\n- Python, C/C++, Java, ARMv8 Assembly, Javascript, Racket, OCaml, R, C#, Bash\n- Seasoned with Git and utilizing continuous integration tools such as GitHub Actions.\n- Versed in utilizing cloud-based virtual machines via Secure Socket Shell(SSH) Protocol.\n- Pro fi cient with database management systems and engines such as PostgresQL and MongoDB.",
        },
        {
          name: "Experience",
          content: "EXPERIENCE",
          extracted:
            "Student Assistant— \nStevens Institute of Technology, Hoboken, NJ \n(Oct 2023 – Present)\n- Designed and programmed an interactive dashboard capable of viewing, editing, and analyzing speci fi c model data.\n- Coordinated with 6 other team members to integrate their contributions into the dashboard e  ciently.\n- Delivered periodic presentations and demonstrations to over 40 supervisors and project clients.\nCourse Assistant— \nStevens Institute of Technology, Hoboken, NJ \n(Sept 2023 – Present)\n- Re fi ned class assignments and homeworks to ensure a lack of typographical and logical errors.\n- Taught weekly lab sessions to 35 students to cement their understanding in the curriculum.\n- Streamlined the grading process by constructing a script to automatically grade homeworks for 200 students.\n- Conducted weekly o  ce hours to answer any questions regarding the subject material.\nResearch Assistant – \nStevens Institute of Technology, Hoboken, NJ \n(Summer 2022, Summer 2023)\n- Spearheaded design and construction of Python scripts to download, analyze, and store over 690,000 image \nfi les safely.\n- Utilized aforementioned scripts to e  ectively \nfi lter images to curate a sample of 3,600 high-quality image \nfi les.\n- Implemented scripts to interact with GIS software technologies such as ArcGIS to correlate geographic image metadata\nwith a 2D map of Mercury to visualize physical locations of each image \nfi le.\n- Coordinated with 4 colleagues in the research group to facilitate e  cient and standardized code.",
        },
        {
          name: "Projects",
          content: "PROJECTS",
          extracted:
            "ANGEL \n— \nNode-based Downloader and Converter Application \n(Summer 2023) – GitHub Repository\n- Electron-based Node and React application to download and convert audio and video \nfi les.\n- Features ability to choose download quality, either through video resolution, audio quality, or frame rate.\n- Utilizes \n mpeg for video and audio conversion from any supported container format to another.\n- Editable settings including di  erent view modes, custom download preferences, and accessibility options.\nScrumptious Solar Services — \nFull-stack Web Application \n(Spring 2023) – GitHub Repository\n- Directed a 6-person team in the production of a web application to streamline the processes of a solar panel company.\n- Integrated several di  erent technologies, including React, Express, Stripe, and Firebase in the end-product.\n- Implemented Agile development methodology over 4 two-week sprints, producing a workable demo each sprint.\n- Recipient of “Outstanding Project Award” out of 35 total teams by the project client.",
        },
        {
          name: "Skills or Extracurriculars",
          content: "VOLUNTEER & EXTRACURRICULARS",
          extracted:
            "Vice President — \nStevens Computer Science Club \n(Fall 2023 – Present)\n- Composed weekly newsletter to inform the over 300 club members of important events and opportunities.\n- Ensured club meetings had a room reserved with adequate space for all members.\n- Guided workshops and presentations on essential computer science topics.",
        },
        {
          name: "Awards or Honors",
          content: "AWARDS & ACCOLADES",
          extracted:
            "- Stevens Institute of Technology Dean’s List– Fall 2021, Spring 2022, Fall 2022, Spring 2023\n- Outstanding Project Award in recognition of work done on \nScrumptious Solar Services \n– Spring 2023",
        },
      ],
      pdfJSON: {
        name: "Joshua Bernstein",
        email: "joshuatbernstein@gmail.com",
        phone: "201-249-3266",
        education: {
          school: "Stevens Institute of Technology,",
          location: "Hoboken, NJ—",
          degree: "",
          fieldOfStudy: "",
          to: {
            month: "graduation",
            year: "date",
          },
          gpa: "",
          scale: "",
          awards: "",
          courses: "",
        },
        experience: {},
      },
    };
    const {
      employer_name,
      job_title,
      useResume,
      resumeData,
      useScraper,
      scrapedData,
    } = req.body;

    const response = await genLetter(
      user_id,
      employer_name,
      job_title,
      useResume,
      resumeData,
      useScraper,
      scrapedData
    );

    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

router.route("/genBasicLetter").post(async (req, res) => {
  const description = req.body.description;
  const response = await genBasicLetter(description);
  return res.status(200).json(response);
});

/**
 * @swagger
 * paths:
 *   /covers/updateCoverLetter:
 *     patch:
 *       summary: Updates a specific cover letter
 *       description: >
 *         This endpoint updates an existing cover letter's content with the new description provided. It requires the cover letter ID and the new paragraphs as input.
 *       operationId: updateCoverLetter
 *       tags:
 *         - Cover Letters
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - cover_id
 *                 - description
 *               properties:
 *                 cover_id:
 *                   type: string
 *                   description: The unique identifier of the cover letter to be updated.
 *                 description:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: The new paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *             example:
 *               cover_id: "623d6e9d9e2b6f001f2f5c7d"
 *               description:
 *                 - "Dear Hiring Manager,"
 *                 - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                 - "With my experience in software development..."
 *                 - "I believe my skills make me a perfect fit for this role..."
 *                 - "Thank you for considering my application."
 *                 - "Sincerely, John Doe"
 *       responses:
 *         '200':
 *           description: Successfully updated cover letter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The updated paragraphs of the cover letter.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *         '400':
 *           description: Bad request. Invalid input or missing fields.
 *         '401':
 *           description: Unauthorized. User is not authenticated.
 *         '404':
 *           description: Not found. Cover letter with the given ID does not exist.
 *         '500':
 *           description: Internal server error.
 */

router
  .route("/updateCoverLetter")
  .patch(
    ClerkExpressRequireAuth({ authorizedParties: [process.env.CLIENT_URL] }),
    async (req, res) => {
      const cover_id = req.body.cover_id;
      const description = req.body.description;
      const response = await updateCoverLetter(cover_id, description);
      return res.status(200).json(response);
    }
  );

/**
 * @swagger
 * paths:
 *   /covers/getAllCoverLetters:
 *     get:
 *       summary: Retrieves all cover letters from a user
 *       description: >
 *         This endpoint fetches all cover letters associated with a user, identified by their user ID.
 *       operationId: getAllCoverLetters
 *       tags:
 *         - Cover Letters
 *       parameters:
 *         - in: header
 *           name: Authorization
 *           required: true
 *           schema:
 *             type: string
 *           description: Bearer token for authenticating the request.
 *       responses:
 *         '200':
 *           description: Successfully retrieved all cover letters
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: ObjectId
 *                       description: The unique identifier for the cover letter.
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       description: The unique identifier for the user.
 *                     date:
 *                       type: string
 *                       format: date
 *                       description: The date when the cover letter was generated.
 *                     first_name:
 *                       type: string
 *                       description: The first name of the user.
 *                     last_name:
 *                       type: string
 *                       description: The last name of the user.
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: The email address of the user.
 *                     employer_name:
 *                       type: string
 *                       description: The name of the employer or the company to which the cover letter is addressed.
 *                     paragraphs:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: An array containing the paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   - _id: ObjectID('623d6e9d9e2b6f001f2f5c7d')
 *                     user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                     date: "2024-03-04"
 *                     first_name: "John"
 *                     last_name: "Doe"
 *                     email: "john.doe@example.com"
 *                     employer_name: "Acme Corp"
 *                     paragraphs:
 *                       - "Dear Hiring Manager,"
 *                       - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                       - "With my experience in software development..."
 *                       - "I believe my skills make me a perfect fit for this role..."
 *                       - "Thank you for considering my application."
 *                       - "Sincerely, John Doe"
 *         '401':
 *           description: Unauthorized. User is not authenticated.
 *         '500':
 *           description: Internal server error.
 */

router.route("/getAllCoverLetters").get(async (req, res) => {
  const user_id = req.auth.sessionClaims.sub;
  const response = await getAllCoverLettersFromUser(user_id);
  return res.status(200).json(response);
});

/**
 * @swagger
 * paths:
 *   /covers/getCoverLetterById/{id}:
 *     get:
 *       summary: Retrieves a specific cover letter by ID
 *       description: >
 *         This endpoint fetches a specific cover letter using its unique identifier provided as a path parameter.
 *       operationId: getCoverLetterById
 *       tags:
 *         - Cover Letters
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *           description: The unique identifier of the cover letter to retrieve.
 *       responses:
 *         '200':
 *           description: Successfully retrieved cover letter
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the cover letter.
 *                   user_id:
 *                     type: string
 *                     format: uuid
 *                     description: The unique identifier for the user.
 *                   date:
 *                     type: string
 *                     format: date
 *                     description: The date when the cover letter was generated.
 *                   first_name:
 *                     type: string
 *                     description: The first name of the user.
 *                   last_name:
 *                     type: string
 *                     description: The last name of the user.
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: The email address of the user.
 *                   employer_name:
 *                     type: string
 *                     description: The name of the employer or the company to which the cover letter is addressed.
 *                   paragraphs:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The paragraphs of the cover letter, including a greeting, at least three body paragraphs, a closing statement, and a signature.
 *                 example:
 *                   _id: "623d6e9d9e2b6f001f2f5c7d"
 *                   user_id: "user_2dC6mNNpMcxT5kubchWOsfUs2TB"
 *                   date: "2024-03-04"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "john.doe@example.com"
 *                   employer_name: "Acme Corp"
 *                   paragraphs:
 *                     - "Dear Hiring Manager,"
 *                     - "I am excited to apply for the Software Engineer position at Acme Corp..."
 *                     - "With my experience in software development..."
 *                     - "I believe my skills make me a perfect fit for this role..."
 *                     - "Thank you for considering my application."
 *                     - "Sincerely, John Doe"
 *         '400':
 *           description: Bad request. Invalid input or missing fields.
 *         '404':
 *           description: Not found. Cover letter with the given ID does not exist.
 *         '500':
 *           description: Internal server error.
 */

router.route("/getCoverLetterById/:id").get(async (req, res) => {
  const cover_id = req.params.id;
  const response = await getCoverLetterById(cover_id);
  return res.status(200).json(response);
});

export default router;
