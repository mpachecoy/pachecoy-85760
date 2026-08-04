import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Mock", () => {

    before(() => {
        console.log("--- INICIO TEST FUNCIONAL MOCK ---");
    });

    after(() => {
        console.log("--- FIN TEST FUNCIONAL MOCK ---");
    });

    describe("GET /api/mocks/users/:n", () => {
        it("Devuelve n usuarios mock con la estructura esperada", async () => {
            const response = await request.get("/api/mocks/users/5");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.payload).to.be.an("array").with.lengthOf(5);
            expect(response.body.payload[0]).to.have.all.keys("firstName", "lastName", "email", "password", "role");
        });

        it("Devuelve 400 si n no es un número válido", async () => {
            const response = await request.get("/api/mocks/users/abc");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_INPUT");
        });

        it("Devuelve 400 si n es negativo", async () => {
            const response = await request.get("/api/mocks/users/-3");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_INPUT");
        });
    });

    describe("GET /api/mocks/stores/:n", () => {
        it("Devuelve n tiendas mock", async () => {
            const response = await request.get("/api/mocks/stores/3");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array").with.lengthOf(3);
        });
    });

    describe("GET /api/mocks/products/:n", () => {
        it("Devuelve n productos mock", async () => {
            const response = await request.get("/api/mocks/products/3");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array").with.lengthOf(3);
        });
    });

    describe("GET /api/mocks/orders/:n", () => {
        it("Devuelve n pedidos mock", async () => {
            const response = await request.get("/api/mocks/orders/2");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array").with.lengthOf(2);
        });
    });

    describe("GET /api/mocks/deliveries/:n", () => {
        it("Devuelve n entregas mock", async () => {
            const response = await request.get("/api/mocks/deliveries/2");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array").with.lengthOf(2);
        });
    });

    describe("POST /api/mocks/users/:n", () => {
        it("Genera y guarda n usuarios mock en la base, sin exponer el password", async () => {
            const response = await request.post("/api/mocks/users/2");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array").with.lengthOf(2);
            expect(response.body.payload[0]).to.have.property("_id");
            expect(response.body.payload[0]).to.not.have.property("password");

            const ids = response.body.payload.map((u) => u._id);
            await UserModel.deleteMany({ _id: { $in: ids } });
        });
    });
});