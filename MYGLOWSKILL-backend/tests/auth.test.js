const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("🔐 Tests Authentification", () => {
  beforeAll(async () => {
    // Connexion à une base de données de test
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/myglowskills_test");
  });

  afterAll(async () => {
    // Nettoyage et fermeture
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v1/auth/register", () => {
    it(" Devrait créer un nouvel utilisateur", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "John Doe",
          email: "john@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.user.email).toBe("john@example.com");
    });

    it(" Devrait refuser un email en double", async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Jane Doe",
          email: "jane@example.com",
          password: "password123",
        });

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Jane Smith",
          email: "jane@example.com",
          password: "password456",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("déjà utilisé");
    });

    it(" Devrait refuser un mot de passe trop court", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Bob",
          email: "bob@example.com",
          password: "123",
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    beforeAll(async () => {
      await request(app)
        .post("/api/v1/auth/register")
        .send({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        });
    });

    it(" Devrait connecter un utilisateur avec des identifiants valides", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it(" Devrait refuser des identifiants incorrects", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain("Identifiants incorrects");
    });

    it(" Devrait refuser un email inexistant", async () => {
      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
