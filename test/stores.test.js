import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import { generateToken } from "../src/utils/jwt.utils.js";
import { USER_ROLES } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Stores", () => {
    let admin, adminToken;
    let owner, ownerToken;
    let outsider, outsiderToken;
    let customer, customerToken;
    let createdStoreId;

    before(async () => {
        admin = await UserModel.create({
            firstName: "Admin", lastName: "Test",
            email: `admin.stores.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.ADMIN
        });
        adminToken = generateToken(admin);

        owner = await UserModel.create({
            firstName: "Dueño", lastName: "Test",
            email: `owner.stores.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        ownerToken = generateToken(owner);

        outsider = await UserModel.create({
            firstName: "Otro", lastName: "Dueño",
            email: `outsider.stores.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        outsiderToken = generateToken(outsider);

        customer = await UserModel.create({
            firstName: "Cliente", lastName: "Test",
            email: `customer.stores.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.CUSTOMER
        });
        customerToken = generateToken(customer);
    });

    after(async () => {
        if (createdStoreId) {
            await StoreModel.findByIdAndDelete(createdStoreId);
        }
        await UserModel.deleteMany({ _id: { $in: [admin._id, owner._id, outsider._id, customer._id] } });
    });

    describe("POST /api/stores", () => {
        it("Rechaza la creación sin token (401)", async () => {
            const response = await request.post("/api/stores").send({
                name: "Tienda Sin Token",
                address: "Calle 1",
                owner: owner._id
            });

            expect(response.status).to.equal(401);
        });

        it("Rechaza crear una tienda a nombre de otro usuario (403)", async () => {
            const response = await request
                .post("/api/stores")
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({
                    name: "Tienda Ajena",
                    address: "Calle 1",
                    owner: outsider._id
                });

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("Rechaza si el owner no tiene rol 'store' (400)", async () => {
            const response = await request
                .post("/api/stores")
                .set("Cookie", `accessToken=${customerToken}`)
                .send({
                    name: "Tienda Inválida",
                    address: "Calle 1",
                    owner: customer._id
                });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ROLE");
        });

        it("Crea una tienda válida cuando el owner es vos mismo", async () => {
            const response = await request
                .post("/api/stores")
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({
                    name: "Tienda Test",
                    address: "Calle Falsa 123",
                    owner: owner._id
                });

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.have.property("_id");
            createdStoreId = response.body.payload._id;
        });
    });

    describe("GET /api/stores", () => {
        it("Lista las tiendas sin necesidad de token (público)", async () => {
            const response = await request.get("/api/stores");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/stores/:sid", () => {
        it("Devuelve la tienda por ID sin necesidad de token (público)", async () => {
            const response = await request.get(`/api/stores/${createdStoreId}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdStoreId);
            expect(response.body.payload.owner).to.not.have.property("password");
        });

        it("Devuelve 404 si la tienda no existe", async () => {
            const response = await request.get("/api/stores/000000000000000000000000");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("STORE_NOT_FOUND");
        });
    });

    describe("PUT /api/stores/:sid", () => {
        it("Rechaza la actualización si no sos el dueño (403)", async () => {
            const response = await request
                .put(`/api/stores/${createdStoreId}`)
                .set("Cookie", `accessToken=${outsiderToken}`)
                .send({ address: "Otra Calle 456" });

            expect(response.status).to.equal(403);
        });

        it("El dueño puede actualizar su tienda", async () => {
            const response = await request
                .put(`/api/stores/${createdStoreId}`)
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({ address: "Otra Calle 456" });

            expect(response.status).to.equal(200);
            expect(response.body.payload.address).to.equal("Otra Calle 456");
        });
    });

    describe("DELETE /api/stores/:sid", () => {
        it("Rechaza el borrado si no sos el dueño ni admin (403)", async () => {
            const response = await request
                .delete(`/api/stores/${createdStoreId}`)
                .set("Cookie", `accessToken=${outsiderToken}`);

            expect(response.status).to.equal(403);
        });

        it("El dueño puede borrar su tienda", async () => {
            const response = await request
                .delete(`/api/stores/${createdStoreId}`)
                .set("Cookie", `accessToken=${ownerToken}`);

            expect(response.status).to.equal(200);

            createdStoreId = null;
        });
    });
});