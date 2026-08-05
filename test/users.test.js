import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import { generateToken } from "../src/utils/jwt.utils.js";
import { USER_ROLES } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Users", () => {
    let adminUser, adminToken;
    let otherUser, otherToken;
    let createdUserId, ownToken;

    before(async () => {
        adminUser = await UserModel.create({
            firstName: "Admin",
            lastName: "Test",
            email: `admin.${Date.now()}@mail.com`,
            password: "clave123",
            role: USER_ROLES.ADMIN
        });
        adminToken = generateToken(adminUser);

        otherUser = await UserModel.create({
            firstName: "Otro",
            lastName: "Usuario",
            email: `otro.${Date.now()}@mail.com`,
            password: "clave123",
            role: USER_ROLES.CUSTOMER
        });
        otherToken = generateToken(otherUser);
    });

    after(async () => {
        const ids = [adminUser._id, otherUser._id];
        if (createdUserId) ids.push(createdUserId);
        await UserModel.deleteMany({ _id: { $in: ids } });
    });

    describe("POST /api/users", () => {
        it("Rechaza la creación sin token (401)", async () => {
            const response = await request.post("/api/users").send({
                firstName: "Sin",
                lastName: "Token",
                email: `sintoken.${Date.now()}@mail.com`,
                password: "clave123"
            });

            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal("UNAUTHORIZED");
        });

        it("Rechaza la creación si el token no es de admin (403)", async () => {
            const response = await request
                .post("/api/users")
                .set("Authorization", `Bearer ${otherToken}`)
                .send({
                    firstName: "Sin",
                    lastName: "Permiso",
                    email: `sinpermiso.${Date.now()}@mail.com`,
                    password: "clave123"
                });

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("Como admin, crea un usuario válido y responde 201 sin exponer el password", async () => {
            const response = await request
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({
                    firstName: "Test",
                    lastName: "User",
                    email: `test.user.${Date.now()}@mail.com`,
                    password: "clave123"
                });

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.not.have.property("password");

            createdUserId = response.body.payload._id;
            ownToken = generateToken({ _id: createdUserId });
        });

        it("Como admin, rechaza la creación si faltan datos requeridos (400)", async () => {
            const response = await request
                .post("/api/users")
                .set("Authorization", `Bearer ${adminToken}`)
                .send({ firstName: "Incompleto" });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });
    });

    describe("GET /api/users", () => {
        it("Rechaza el listado sin token (401)", async () => {
            const response = await request.get("/api/users");

            expect(response.status).to.equal(401);
        });

        it("Rechaza el listado si no sos admin (403)", async () => {
            const response = await request
                .get("/api/users")
                .set("Authorization", `Bearer ${otherToken}`);

            expect(response.status).to.equal(403);
        });

        it("Como admin, devuelve la lista de usuarios", async () => {
            const response = await request
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/users/:uid", () => {
        it("Un usuario puede ver su propio perfil", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${ownToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdUserId);
        });

        it("Como admin, devuelve el usuario por ID", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
        });

        it("Rechaza ver el perfil de otro usuario si no sos admin (403)", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Authorization", `Bearer ${otherToken}`);

            expect(response.status).to.equal(403);
        });

        it("Devuelve 404 si el usuario no existe", async () => {
            const response = await request
                .get("/api/users/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");
        });

        it("Devuelve 400 si el ID no tiene formato válido de Mongo", async () => {
            const response = await request
                .get("/api/users/id-invalido")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });
});