import { describe, it, expect, beforeAll } from "vitest";
import supertest from "supertest";
import app from "../app.js";

const request = supertest(app);

// ─── AUTH TESTS ───────────────────────────────────────────────────────────────

describe("POST /users/register", () => {
  it("returns 400 if required fields are missing", async () => {
    const res = await request.post("/users/register").send({
      email: "test@test.com",
      // missing password, firstname, lastname
    });
    expect(res.status).toBe(400);
  });

  it("returns 400 if email is already taken", async () => {
    const res = await request.post("/users/register").send({
      email: "testuser2@test.com",
      password: "12345678",
      firstname: "Test",
      lastname: "User",
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /users/login", () => {
  it("returns 400 if required fields are missing", async () => {
    const res = await request.post("/users/login").send({
      email: "testuser2@test.com",
      // missing password
    });
    expect(res.status).toBe(400);
  });

  it("returns 401 with invalid credentials", async () => {
    const res = await request.post("/users/login").send({
      email: "fake@fake.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("returns 401 with correct email but wrong password", async () => {
    const res = await request.post("/users/login").send({
      email: "testuser2@test.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("returns token and user with valid credentials", async () => {
    const res = await request.post("/users/login").send({
      email: "testuser2@test.com",
      password: "12345678",
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("user");
    expect(res.body.user.email).toBe("testuser2@test.com");
  });
});

// ─── PROTECTED ROUTE TESTS ────────────────────────────────────────────────────

describe("Protected routes reject unauthenticated requests", () => {
  it("GET /users/me returns 401 without token", async () => {
    const res = await request.get("/users/me");
    expect(res.status).toBe(401);
  });

  it("PATCH /users/path returns 401 without token", async () => {
    const res = await request.patch("/users/path").send({ path: "Novice" });
    expect(res.status).toBe(401);
  });

  it("PATCH /users/me/profile returns 401 without token", async () => {
    const res = await request.patch("/users/me/profile").send({
      firstname: "Hacker",
      lastname: "Smith",
      email: "hacker@hack.com",
    });
    expect(res.status).toBe(401);
  });

  it("GET /stats returns 401 without token", async () => {
    const res = await request.get("/stats");
    expect(res.status).toBe(401);
  });

  it("GET /progress returns 401 without token", async () => {
    const res = await request.get("/progress");
    expect(res.status).toBe(401);
  });

  it("GET /xp returns 401 without token", async () => {
    const res = await request.get("/xp");
    expect(res.status).toBe(401);
  });

  it("POST /progress/video-complete returns 401 without token", async () => {
    const res = await request.post("/progress/video-complete").send({
      userId: 1,
      videoId: "abc123",
      xpEarned: 5,
      skillCategory: "Theory",
    });
    expect(res.status).toBe(401);
  });
});

// ─── AUTHENTICATED ROUTE TESTS ────────────────────────────────────────────────

describe("Authenticated routes work with valid token", () => {
  let token;

  beforeAll(async () => {
    const res = await request.post("/users/login").send({
      email: "testuser2@test.com",
      password: "12345678",
    });
    token = res.body.token;
  });

  it("GET /users/me returns user data", async () => {
    const res = await request
      .get("/users/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("id");
  });

  it("GET /stats returns stats data", async () => {
    const res = await request
      .get("/stats")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });

  it("GET /xp returns XP history", async () => {
    const res = await request
      .get("/xp")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("bodyIdMatchesSession blocks requests for other users", async () => {
    const res = await request
      .post("/progress/video-complete")
      .set("Authorization", `Bearer ${token}`)
      .send({
        userId: 99999, // different user ID
        videoId: "abc123",
        xpEarned: 5,
        skillCategory: "Theory",
      });
    expect(res.status).toBe(401);
  });
});

// ─── GOOGLE OAUTH TESTS ───────────────────────────────────────────────────────

describe("Google OAuth routes", () => {
  it("GET /auth/google redirects to Google", async () => {
    const res = await request.get("/auth/google");
    expect(res.status).toBe(302);
    expect(res.headers.location).toContain("accounts.google.com");
  });

  it("GET /auth/user-status returns loggedIn false for unauthenticated", async () => {
    const res = await request.get("/auth/user-status");
    expect(res.status).toBe(200);
    expect(res.body.loggedIn).toBe(false);
  });
});
