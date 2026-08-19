import { describe, it, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import RefreshTokenModel from "../src/models/refreshToken.model.js";

const request = supertest(app);

const getCookieValue = (response, name) => {
    const cookies = response.headers["set-cookie"] || [];
    const match = cookies.find((c) => c.startsWith(`${name}=`));
    if (!match) return null;
    return match.split(";")[0].split("=")[1];
};

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
        it("Registra un usuario y setea las cookies de sesión", async () => {
            const response = await request.post("/api/auth/register").send({
                firstName: "Auth", lastName: "Test", email, password
            });

            expect(response.status).to.equal(201);
            expect(response.body.payload.user).to.not.have.property("password");
            expect(response.body.payload).to.not.have.property("accessToken");
            expect(getCookieValue(response, "accessToken")).to.be.a("string");
            expect(getCookieValue(response, "refreshToken")).to.be.a("string");

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

        it("Loguea correctamente y setea las cookies", async () => {
            const response = await request.post("/api/auth/login").send({ email, password });

            expect(response.status).to.equal(200);
            expect(getCookieValue(response, "accessToken")).to.be.a("string");
            expect(getCookieValue(response, "refreshToken")).to.be.a("string");
        });
    });

    describe("POST /api/auth/refresh", () => {
        it("Rechaza sin cookie de refresh (400)", async () => {
            const response = await request.post("/api/auth/refresh");

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });

        it("Renueva el access token y lo rota", async () => {
            const loginResponse = await request.post("/api/auth/login").send({ email, password });
            const refreshToken = getCookieValue(loginResponse, "refreshToken");

            const refreshResponse = await request
                .post("/api/auth/refresh")
                .set("Cookie", `refreshToken=${refreshToken}`);

            expect(refreshResponse.status).to.equal(200);
            const newRefreshToken = getCookieValue(refreshResponse, "refreshToken");
            expect(newRefreshToken).to.not.equal(refreshToken);

            const reuseResponse = await request
                .post("/api/auth/refresh")
                .set("Cookie", `refreshToken=${refreshToken}`);
            expect(reuseResponse.status).to.equal(401);
        });
    });

    describe("POST /api/auth/logout", () => {
        it("Cierra la sesión y limpia las cookies", async () => {
            const loginResponse = await request.post("/api/auth/login").send({ email, password });
            const refreshToken = getCookieValue(loginResponse, "refreshToken");

            const logoutResponse = await request
                .post("/api/auth/logout")
                .set("Cookie", `refreshToken=${refreshToken}`);

            expect(logoutResponse.status).to.equal(200);

            const refreshAfterLogout = await request
                .post("/api/auth/refresh")
                .set("Cookie", `refreshToken=${refreshToken}`);
            expect(refreshAfterLogout.status).to.equal(401);
        });
    });
});