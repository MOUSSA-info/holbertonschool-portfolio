const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");
const Alert = require("../models/Alert");

let authToken;

describe(" Tests Alertes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || "mongodb://localhost:27017/myglowskills_test");

    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Alert Tester",
        email: "alerttester@example.com",
        password: "password123",
      });

    authToken = res.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Alert.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/v1/alerts", () => {
    it(" Devrait créer une nouvelle alerte", async () => {
      const res = await request(app)
        .post("/api/v1/alerts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          message: "Nouvelle alerte test",
          type: "info",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.alert.message).toBe("Nouvelle alerte test");
    });
  });

  describe("GET /api/v1/alerts", () => {
    it(" Devrait récupérer toutes les alertes", async () => {
      const res = await request(app)
        .get("/api/v1/alerts")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("alerts");
    });
  });

  describe("PATCH /api/v1/alerts/:id/seen", () => {
    it(" Devrait marquer une alerte comme vue", async () => {
      const createRes = await request(app)
        .post("/api/v1/alerts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ message: "Test alerte", type: "warning" });

      const alertId = createRes.body.alert._id;

      const res = await request(app)
        .patch(`/api/v1/alerts/${alertId}/seen`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.alert.seen).toBe(true);
    });
  });
});
