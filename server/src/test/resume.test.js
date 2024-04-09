import request from "supertest";
import app from "../app.js";
import dotenv from "dotenv";
import * as data from "../utils/resume.test.data.js";
dotenv.config();

/* Need to test:
 * Test the /POST route /resumes/manual
 * Test the /POST route /resumes
 * Test the /GET route /resumes/all
 * Test the /GET route /resumes/:id
 * Test the /PUT route /resumes/:id
 * Test the /DELETE route /resumes/:id
 */

const test_token = process.env.TEST_TOKEN;

console.log(test_token[0], test_token.length);

const resumeIds = [];

describe("POST /resumes/manual", () => {
  test("should post a JSON resume to the database", async () => {
    const res = await request(app)
      .post("/resumes/manual")
      .set("Authorization", `Bearer ${test_token}`)
      .send(data.jsonResume);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("resumeType");
    expect(res.body.resumeType).toEqual("json");
    if (res.body && res.body._id) {
      resumeIds.push(res.body._id);
    }
  });
});

describe("POST /resumes", () => {
  test("should post a PDF resume to the database", async () => {
    const res = await request(app)
      .post("/resumes")
      .set("Authorization", `Bearer ${test_token}`)
      .attach("file", data.pdfResumePath);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("resumeType");
    expect(res.body.resumeType).toEqual("pdf");
    if (res.body && res.body._id) {
      resumeIds.push(res.body._id);
    }
  });
});

describe("GET /resumes/all", () => {
  test("should get all resumes from the database", async () => {
    const res = await request(app)
      .get("/resumes/all")
      .set("Authorization", `Bearer ${test_token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});

describe("GET /resumes/:id", () => {
  test("should get a resume by id from the database", async () => {
    for (const id of resumeIds) {
      const res = await request(app)
        .get(`/resumes/${id}`)
        .set("Authorization", `Bearer ${test_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body._id).toEqual(id);
    }
  });
});

describe("PUT /resumes/:id", () => {
  test("should update a resume by id in the database", async () => {
    const res = await request(app)
      .put(`/resumes/${resumeIds[0]}`)
      .set("Authorization", `Bearer ${test_token}`)
      .send(data.jsonResumeUpdated);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id");
    expect(res.body._id).toEqual(resumeIds[0]);
    expect(res.body.pdfJSON).toHaveProperty("name");
    expect(res.body.pdfJSON.name).toEqual(data.jsonResumeUpdated.name);
  });
});

describe("DELETE /resumes/:id", () => {
  test("should delete a resume by id from the database", async () => {
    for (const id of resumeIds) {
      const res = await request(app)
        .delete(`/resumes/${id}`)
        .set("Authorization", `Bearer ${test_token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("deletedCount");
      expect(res.body.deletedCount).toEqual(1);
    }
  });
});
