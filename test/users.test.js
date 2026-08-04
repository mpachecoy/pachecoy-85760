import { describe, it, after, before } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Users", () => {
    before(() => {
        console.log("--- INICIO TEST FUNCIONAL USERS ---");
    })
    let createdUserId;

    after(async () => {
        if (createdUserId) {
            await UserModel.findByIdAndDelete(createdUserId);
        }
        console.log("--- FIN TEST FUNCIONAL USERS ---");
    });

    describe("POST /api/users", () => {
        it("Crea un usuario válido y responde 201 sin exponer el password", async () => {
            const response = await request.post("/api/users").send({
                firstName: "Test",
                lastName: "User",
                email: `test.user.${Date.now()}@mail.com`,
                password: "clave123"
            });

            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.have.property("_id");
            expect(response.body.payload).to.have.property("email");
            expect(response.body.payload).to.not.have.property("password");

            createdUserId = response.body.payload._id;
        });

        it("Rechaza la creación si faltan datos requeridos (400)", async () => {
            const response = await request.post("/api/users").send({
                firstName: "Incompleto"
            });

            expect(response.status).to.equal(400);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });
    });

    describe("GET /api/users", () => {
        it("Devuelve la lista de usuarios con el formato esperado", async () => {
            const response = await request.get("/api/users");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/users/:uid", () => {
        it("Devuelve el usuario creado por su ID", async () => {
            const response = await request.get(`/api/users/${createdUserId}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdUserId);
        });

        it("Devuelve 404 si el usuario no existe", async () => {
            const fakeId = "000000000000000000000000";
            const response = await request.get(`/api/users/${fakeId}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("USER_NOT_FOUND");
        });

        it("Devuelve 400 si el ID no tiene formato válido de Mongo", async () => {
            const response = await request.get("/api/users/id-invalido");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ID");
        });
    });
});