import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";

const request = supertest(app);

describe("Test FUNCIONAL - Logger, Swagger y rutas inexistentes", () => {

    before(() => {
        console.log("--- INICIO TEST FUNCIONAL UTILS ---");
    });

    after(() => {
        console.log("--- FIN TEST FUNCIONAL UTILS ---");
    });

    describe("GET /", () => {
        it("Devuelve el status de la API", async () => {
            const response = await request.get("/");

            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({
                status: "success",
                message: "ShipNow API"
            });
        });
    });

    describe("GET /health", () => {
        it("Devuelve el healthcheck con entorno, uptime y timestamp", async () => {
            const response = await request.get("/health");

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal("success");
            expect(response.body.message).to.equal("API funcionando");
            expect(response.body.environment).to.equal("test");
            expect(response.body.uptime).to.be.a("number");
            expect(response.body.timestamp).to.be.a("string");
            expect(new Date(response.body.timestamp).toString()).to.not.equal("Invalid Date");
        });
    });

    describe("GET /api/loggerTest", () => {
        it("Dispara los logs y responde 200 con el formato esperado", async () => {
            const response = await request.get("/api/loggerTest");

            expect(response.status).to.equal(200);
            expect(response.body).to.deep.equal({
                status: "success",
                message: "Logs generados correctamente"
            });
        });
    });

    describe("GET /api/docs", () => {
        it("Redirige a /api/docs/ cuando falta la barra final", async () => {
            const response = await request.get("/api/docs");

            expect(response.status).to.equal(301);
            expect(response.headers.location).to.equal("/api/docs/");
        });

        it("Sirve la interfaz de Swagger UI en /api/docs/", async () => {
            const response = await request.get("/api/docs/");

            expect(response.status).to.equal(200);
            expect(response.headers["content-type"]).to.include("text/html");
            expect(response.text).to.include("swagger-ui");
        });
    });

    describe("Ruta inexistente", () => {
        it("Devuelve 404 con el formato de error estándar", async () => {
            const response = await request.get("/api/ruta-que-no-existe");

            expect(response.status).to.equal(404);
            expect(response.body.status).to.equal("error");
            expect(response.body.error).to.equal("ROUTE_NOT_FOUND");
            expect(response.body.message).to.include("Ruta no encontrada");
        });
    });
});