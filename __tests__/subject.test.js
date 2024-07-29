const request = require("supertest");
const app = require("../server");
const Subject = require("../models/Student");

describe("Subjects API", () => {
  const testId = Math.floor(Math.random() * (987654321 - 123456789) + 123456789);

  it("should create a new subject with an id of " + testId, async () => {
    const res = await request(app)
      .post("/subjects")
      .send({ id: testId, name: "Test Subject with ID " });
    expect(res.statusCode).toBe(201);
  });

  it("should get all subjects", async () => {
    const res = await request(app).get("/subjects");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a single subject by id of " + testId, async () => {
    const res = await request(app).get(`/subjects/${testId}`);
    expect(res.statusCode).toBe(200);
  });

  it("should update the subject with id of " + testId, async () => {
    const res = await request(app)
      .put(`/subjects/${testId}`)
      .send({ name: "Updated Subject of ID " + testId });
    expect(res.statusCode).toBe(200);
  });

  it("should delete the subject with id of " + testId, async () => {
    const res = await request(app).delete(`/subjects/${testId}`);
    expect(res.statusCode).toBe(200);
  });
});
