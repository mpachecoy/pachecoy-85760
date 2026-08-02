import { describe, it, before, after } from "node:test";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Mock", () => {

    before(() => {
        console.log("--- INICIO TEST FUNCIONAL MOCK ---");
    })

    after(() => {
        console.log("--- FIN TEST FUNCIONAL MOCK ---");
    })


    it("Validacion de status http", async () => {
        const response = await request.get("/api/mocks/users/5");
        expect(response.status).to.equal(200);
    })
    it("Validacion de la respuesta sea un objeto", async () => {
        const response = await request.get("/api/mocks/users/5");
        expect(response.body).to.be.an("object");
    })
});