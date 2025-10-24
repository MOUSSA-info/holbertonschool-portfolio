const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Data = require("../models/Data");

let authToken;
let userId;

describe(" Tests Données (Data)", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/myglowskills_test");

    // Créer un utilisateur de test
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Data Tester",
        email: "datatester@example.com",
        password: "password123",
      });

    authToken = res.body.token;
    userId = res.body.user.id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Data.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v1/data", () => {
    it(" Devrait créer une nouvelle donnée", async () => {
      const res = await request(app)
        .post("/api/v1/data")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          label: "Donnée test",
          content: "Contenu de la donnée",
          category: "personal",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.label).toBe("Donnée test");
    });

    it(" Devrait refuser sans authentification", async () => {
      const res = await request(app)
        .post("/api/v1/data")
        .send({
          label: "Test",
          content: "Test content",
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/v1/data", () => {
    it(" Devrait récupérer toutes les données de l'utilisateur", async () => {
      const res = await request(app)
        .get("/api/v1/data")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("data");
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe("PUT /api/v1/data/:id", () => {
    it(" Devrait mettre à jour une donnée existante", async () => {
      const createRes = await request(app)
        .post("/api/v1/data")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ label: "Original", content: "Original content" });

      const dataId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/v1/data/${dataId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ label: "Mis à jour" });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.label).toBe("Mis à jour");
    });
  });

  describe("DELETE /api/v1/data/:id", () => {
    it(" Devrait supprimer une donnée", async () => {
      const createRes = await request(app)
        .post("/api/v1/data")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ label: "À supprimer", content: "Test" });

      const dataId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/v1/data/${dataId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toContain("supprimée");
    });
  });
});
