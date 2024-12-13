const request = require("supertest");
const { app } = require("../server");
const User = require("../models/user");


describe("AuthController", () => {
  beforeEach(async () => {
    await User.deleteMany(); // Clear User collection before each test
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "User registered successfully");
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("should login an existing user", async () => {
    const user = new User({
      email: "test@example.com",
      username: "testuser",
      password: "password123",
    });
    await user.save();

    const res = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test@example.com");
  });

  it("should return error for invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "invalid@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
