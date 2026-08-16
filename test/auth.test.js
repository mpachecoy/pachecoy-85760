import { describe, it, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import RefreshTokenModel from "../src/models/refreshToken.model.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Auth", () => {
    let createdUserId;
    const email = `auth.test.${Date.now()}@mail.com`;
    const password = "clave123";

    after(async () => {
        if (createdUserId) {
            await UserModel.findByIdAndDelete(createdUserId);
            await RefreshTokenModel.deleteMany({ user: createdUserId });
        }
    });

    describe("POST /api/auth/register", () => {
        it("Registra un usuario y devuelve accessToken + refreshToken", async () => {
            const response = await request.post("/api/auth/register").send({
                firstName: "Auth", lastName: "Test", email, password
            });

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.have.property("accessToken");
            expect(response.body.payload).to.have.property("refreshToken");
            expect(response.body.payload.user).to.not.have.property("password");
            expect(response.body.payload.user.role).to.equal("customer");

            createdUserId = response.body.payload.user._id;
        });

        it("Ignora el role que mande el cliente (siempre customer)", async () => {
            const response = await request.post("/api/auth/register").send({
                firstName: "Otro", lastName: "Test",
                email: `otro.${Date.now()}@mail.com`,
                password: "clave123",
                role: "admin"
            });

            expect(response.status).to.equal(201);
            expect(response.body.payload.user.role).to.equal("customer");

            await UserModel.findByIdAndDelete(response.body.payload.user._id);
            await RefreshTokenModel.deleteMany({ user: response.body.payload.user._id });
        });
    });

    describe("POST /api/auth/login", () => {
        it("Rechaza credenciales inválidas (401)", async () => {
            const response = await request.post("/api/auth/login").send({
                email, password: "claveIncorrecta"
            });

            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal("INVALID_CREDENTIALS");
        });

        it("Loguea correctamente y devuelve tokens", async () => {
            const response = await request.post("/api/auth/login").send({ email, password });

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property("accessToken");
            expect(response.body.payload).to.have.property("refreshToken");
        });
    });

    describe("POST /api/auth/refresh", () => {
        it("Rechaza un refresh token inválido (401)", async () => {
            const response = await request.post("/api/auth/refresh").send({
                refreshToken: "token-que-no-existe"
            });

            expect(response.status).to.equal(401);
            expect(response.body.error).to.equal("INVALID_REFRESH_TOKEN");
        });

        it("Renueva el access token con un refresh token válido, y lo rota", async () => {
            const loginResponse = await request.post("/api/auth/login").send({ email, password });
            const { refreshToken } = loginResponse.body.payload;

            const refreshResponse = await request.post("/api/auth/refresh").send({ refreshToken });

            expect(refreshResponse.status).to.equal(200);
            expect(refreshResponse.body.payload).to.have.property("accessToken");
            expect(refreshResponse.body.payload.refreshToken).to.not.equal(refreshToken);

            const reuseResponse = await request.post("/api/auth/refresh").send({ refreshToken });
            expect(reuseResponse.status).to.equal(401);
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Cierra la sesión y el refresh token deja de servir", async () => {
            const loginResponse = await request.post("/api/auth/login").send({ email, password });
            const { refreshToken } = loginResponse.body.payload;

            const logoutResponse = await request.post("/api/auth/logout").send({ refreshToken });
            expect(logoutResponse.status).to.equal(200);

            const refreshResponse = await request.post("/api/auth/refresh").send({ refreshToken });
            expect(refreshResponse.status).to.equal(401);
        });
    });
});