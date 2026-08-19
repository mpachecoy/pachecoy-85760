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
    let driverUser, driverToken;

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

        driverUser = await UserModel.create({
            firstName: "Chofer",
            lastName: "Test",
            email: `chofer.${Date.now()}@mail.com`,
            password: "clave123",
            role: USER_ROLES.DRIVER
        });
        driverToken = generateToken(driverUser);
    });

    after(async () => {
        const ids = [adminUser._id, otherUser._id, driverUser._id];
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
                .set("Cookie", `accessToken=${otherToken}`)
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
                .set("Cookie", `accessToken=${adminToken}`)
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
                .set("Cookie", `accessToken=${adminToken}`)
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
                .set("Cookie", `accessToken=${otherToken}`)

            expect(response.status).to.equal(403);
        });

        it("Como admin, devuelve la lista de usuarios", async () => {
            const response = await request
                .get("/api/users")
                .set("Cookie", `accessToken=${adminToken}`)

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/users/:uid", () => {
        it("Un usuario puede ver su propio perfil", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Cookie", `accessToken=${adminToken}`)

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdUserId);
        });

        it("Como admin, devuelve el usuario por ID", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Cookie", `accessToken=${adminToken}`)

            expect(response.status).to.equal(200);
        });

        it("Rechaza ver el perfil de otro usuario si no sos admin (403)", async () => {
            const response = await request
                .get(`/api/users/${createdUserId}`)
                .set("Cookie", `accessToken=${otherToken}`)

            expect(response.status).to.equal(403);
        });

        it("Devuelve 404 si el usuario no existe", async () => {
            const response = await request
                .get("/api/users/000000000000000000000000")
                .set("Cookie", `accessToken=${adminToken}`)

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");
        });

        it("Devuelve 400 si el ID no tiene formato válido de Mongo", async () => {
            const response = await request
                .get("/api/users/id-invalido")
                .set("Cookie", `accessToken=${adminToken}`)

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });
    describe("POST /api/users/:uid/document", () => {
        it("Rechaza la subida sin token (401)", async () => {
            const response = await request
                .post(`/api/users/${createdUserId}/document`)
                .field("type", "user_document")
                .attach("document", Buffer.from("contenido de prueba"), "doc.txt");

            expect(response.status).to.equal(401);
        });

        it("Rechaza subir un documento al perfil de otro usuario (403)", async () => {
            const response = await request
                .post(`/api/users/${createdUserId}/document`)
                .set("Cookie", `accessToken=${otherToken}`)
                .field("type", "user_document")
                .attach("document", Buffer.from("contenido de prueba"), "doc.txt");

            expect(response.status).to.equal(403);
        });

        it("Rechaza cargar una licencia si el usuario no es driver (400)", async () => {
            const response = await request
                .post(`/api/users/${createdUserId}/document`)
                .set("Cookie", `accessToken=${otherToken}`)
                .field("type", "driver_license")
                .attach("document", Buffer.from("contenido de prueba"), "licencia.txt");

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("El propio usuario puede subir un documento genérico", async () => {
            const response = await request
                .post(`/api/users/${createdUserId}/document`)
                .set("Cookie", `accessToken=${adminToken}`)
                .field("type", "user_document")
                .attach("document", Buffer.from("contenido de prueba"), "doc.txt");

            expect(response.status).to.equal(200);
            expect(response.body.payload.documents).to.be.an("array").with.lengthOf(1);
            expect(response.body.payload.documents[0].type).to.equal("user_document");
        });

        it("Un driver puede subir su propia licencia", async () => {
            const response = await request
                .post(`/api/users/${driverUser._id}/document`)
                .set("Cookie", `accessToken=${driverToken}`)
                .field("type", "driver_license")
                .attach("document", Buffer.from("contenido de prueba"), "licencia.txt");

            expect(response.status).to.equal(200);
            expect(response.body.payload.documents[0].type).to.equal("driver_license");
        });
    });
});