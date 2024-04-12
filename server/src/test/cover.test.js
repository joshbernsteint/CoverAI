import request from "supertest";
import app from "../app";
import dotenv from "dotenv";
import * as data from "../utils/resume.test.data.js";
import { scraperTestData } from "../utils/scraper.test.data.js";
dotenv.config();

/* Need to test:
 * Test the POST route /covers
 * Test the GET route /covers/:id
 * Test the PATCH route /covers/:id
 * Test the DELETE route /resumes/:id
 * Test the GET route /covers/all
 */

const testToken = process.env.TEST_TOKEN;
let coverLetterIds = [];

describe("DELETE /covers/:id", () => {
  it("should delete all cover letters", async () => {
    const res = await request(app)
      .get("/covers/all")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(200);
    for (const cover of res.body) {
      const del = await request(app)
        .delete(`/covers/${cover._id}`)
        .set("Authorization", `Bearer ${testToken}`);
      expect(del.statusCode).toEqual(200);
    }
  });
});

describe("POST /covers", () => {
  it("should create a cover letter with useResume = false and useScraper = false", async () => {
    const res = await request(app)
      .post("/covers")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        company_name: "Acme Corp",
        job_title: "Software Engineer",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    coverLetterIds.push(res.body._id.toString());
  }, 30000);
});

describe("POST /covers", () => {
  it("should create a cover letter with useResume = true and useScraper = false", async () => {
    const resume = await request(app)
      .post("/resumes/manual")
      .set("Authorization", `Bearer ${testToken}`)
      .send(data.jsonResume);
    expect(resume.statusCode).toEqual(200);
    expect(resume.body).toHaveProperty("resumeType");
    expect(resume.body.resumeType).toEqual("json");
    const resume_id = resume.body._id.toString();
    const res = await request(app)
      .post("/covers")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        company_name: "Microsoft",
        job_title: "Software Engineer",
        useResume: true,
        resumeData: resume_id,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    coverLetterIds.push(res.body._id.toString());
  }, 30000);
});

describe("POST /covers", () => {
  it("should create a cover letter with useResume = true and useScraper = true", async () => {
    const resume = await request(app)
      .post("/resumes/manual")
      .set("Authorization", `Bearer ${testToken}`)
      .send(data.jsonResume);
    expect(resume.statusCode).toEqual(200);
    expect(resume.body).toHaveProperty("resumeType");
    expect(resume.body.resumeType).toEqual("json");
    const resume_id = resume.body._id.toString();
    const res = await request(app)
      .post("/covers")
      .set("Authorization", `Bearer ${testToken}`)
      .send({
        company_name: "Oracle",
        job_title: "Business Development Consultant",
        useResume: true,
        resumeData: resume_id,
        useScraper: true,
        scrapedData: scraperTestData,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    coverLetterIds.push(res.body._id.toString());
  }, 30000);
});

describe("GET /covers/:id", () => {
  it("should retrieve a cover letter by ID", async () => {
    for (const coverLetterId of coverLetterIds) {
      const res = await request(app)
        .get(`/covers/${coverLetterId}`)
        .set("Authorization", `Bearer ${testToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id", coverLetterId);
    }
  });
});

describe("PATCH /covers/:id", () => {
  it("should update a cover letter by ID", async () => {
    for (const coverLetterId of coverLetterIds) {
      const res = await request(app)
        .patch(`/covers/${coverLetterId}`)
        .set("Authorization", `Bearer ${testToken}`)
        .send({
          description: ["Updated paragraph 1", "Updated paragraph 2"],
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body.paragraphs).toEqual(
        expect.arrayContaining(["Updated paragraph 1", "Updated paragraph 2"])
      );
    }
  });
});

describe("GET /covers/all", () => {
  it("should retrieve all cover letters for a user", async () => {
    const res = await request(app)
      .get("/covers/all")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(coverLetterIds.length);
  });
});

describe("DELETE /covers/:id", () => {
  it("should delete a cover letter by ID", async () => {
    for (const coverLetterId of coverLetterIds) {
      const res = await request(app)
        .delete(`/covers/${coverLetterId}`)
        .set("Authorization", `Bearer ${testToken}`);
      expect(res.statusCode).toEqual(200);
    }
  });
});

describe("GET /covers/all", () => {
  it("should retrieve all cover letters for a user and it should be empty", async () => {
    const res = await request(app)
      .get("/covers/all")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });
});
