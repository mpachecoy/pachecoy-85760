import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import ProductModel from "../src/models/product.model.js";
import { generateToken } from "../src/utils/jwt.utils.js";
import { USER_ROLES } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Products", () => {
    let admin, adminToken;
    let owner, ownerToken;
    let outsider, outsiderToken;
    let store, otherStore, createdProductId;

    before(async () => {
        admin = await UserModel.create({
            firstName: "Admin", lastName: "Test",
            email: `admin.products.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.ADMIN
        });
        adminToken = generateToken(admin);

        owner = await UserModel.create({
            firstName: "Dueño", lastName: "Test",
            email: `owner.products.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        ownerToken = generateToken(owner);

        outsider = await UserModel.create({
            firstName: "Otro", lastName: "Dueño",
            email: `outsider.products.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        outsiderToken = generateToken(outsider);

        store = await StoreModel.create({
            name: "Tienda Test", address: "Calle Falsa 123", owner: owner._id
        });

        otherStore = await StoreModel.create({
            name: "Otra Tienda", address: "Calle Falsa 456", owner: outsider._id
        });
    });

    after(async () => {
        if (createdProductId) {
            await ProductModel.findByIdAndDelete(createdProductId);
        }
        await StoreModel.deleteMany({ _id: { $in: [store._id, otherStore._id] } });
        await UserModel.deleteMany({ _id: { $in: [admin._id, owner._id, outsider._id] } });
    });

    describe("POST /api/products", () => {
        it("Rechaza la creación sin token (401)", async () => {
            const response = await request.post("/api/products").send({
                title: "Producto", description: "Desc", price: 10, stock: 5,
                category: "Test", store: store._id
            });

            expect(response.status).to.equal(401);
        });

        it("Rechaza crear un producto en una tienda ajena (403)", async () => {
            const response = await request
                .post("/api/products")
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({
                    title: "Producto Ajeno", description: "Desc", price: 10, stock: 5,
                    category: "Test", store: otherStore._id
                });

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("El dueño de la tienda crea un producto válido", async () => {
            const response = await request
                .post("/api/products")
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({
                    title: "Producto Test", description: "Desc", price: 10, stock: 5,
                    category: "Test", store: store._id
                });

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.have.property("_id");
            createdProductId = response.body.payload._id;
        });

        it("Rechaza si faltan datos requeridos (400)", async () => {
            const response = await request
                .post("/api/products")
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({ title: "Incompleto" });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });
    });

    describe("GET /api/products", () => {
        it("Lista los productos sin necesidad de token (público)", async () => {
            const response = await request.get("/api/products");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/products/:pid", () => {
        it("Devuelve el producto por ID sin token (público)", async () => {
            const response = await request.get(`/api/products/${createdProductId}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdProductId);
        });

        it("Devuelve 404 si el producto no existe", async () => {
            const response = await request.get("/api/products/000000000000000000000000");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });
    });

    describe("PUT /api/products/:pid", () => {
        it("Rechaza la actualización si no sos el dueño de la tienda (403)", async () => {
            const response = await request
                .put(`/api/products/${createdProductId}`)
                .set("Cookie", `accessToken=${outsiderToken}`)
                .send({ price: 20 });

            expect(response.status).to.equal(403);
        });

        it("El dueño de la tienda actualiza el producto", async () => {
            const response = await request
                .put(`/api/products/${createdProductId}`)
                .set("Cookie", `accessToken=${ownerToken}`)
                .send({ price: 20 });

            expect(response.status).to.equal(200);
            expect(response.body.payload.price).to.equal(20);
        });
    });

    describe("DELETE /api/products/:pid", () => {
        it("Rechaza el borrado si no sos el dueño ni admin (403)", async () => {
            const response = await request
                .delete(`/api/products/${createdProductId}`)
                .set("Cookie", `accessToken=${outsiderToken}`);

            expect(response.status).to.equal(403);
        });

        it("El dueño de la tienda puede borrar su producto", async () => {
            const response = await request
                .delete(`/api/products/${createdProductId}`)
                .set("Cookie", `accessToken=${ownerToken}`);

            expect(response.status).to.equal(200);

            createdProductId = null;
        });
    });
});