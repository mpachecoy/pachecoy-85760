import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import ProductModel from "../src/models/product.model.js";
import OrderModel from "../src/models/order.model.js";
import DeliveryModel from "../src/models/delivery.model.js";
import { generateToken } from "../src/utils/jwt.utils.js";
import { USER_ROLES, ORDER_STATUS } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Deliveries", () => {
    let admin, adminToken;
    let storeOwner, storeOwnerToken;
    let driver, driverToken;
    let outsider, outsiderToken;
    let customer, store, product, order, createdDeliveryId;

    before(async () => {
        admin = await UserModel.create({
            firstName: "Admin", lastName: "Test",
            email: `admin.deliveries.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.ADMIN
        });
        adminToken = generateToken(admin);

        storeOwner = await UserModel.create({
            firstName: "Dueño", lastName: "Test",
            email: `owner.deliveries.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        storeOwnerToken = generateToken(storeOwner);

        driver = await UserModel.create({
            firstName: "Repartidor", lastName: "Test",
            email: `driver.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.DRIVER
        });
        driverToken = generateToken(driver);

        outsider = await UserModel.create({
            firstName: "Ajeno", lastName: "Test",
            email: `outsider.deliveries.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.DRIVER
        });
        outsiderToken = generateToken(outsider);

        customer = await UserModel.create({
            firstName: "Cliente", lastName: "Test",
            email: `customer.deliveries.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.CUSTOMER
        });

        store = await StoreModel.create({
            name: "Tienda Test", address: "Calle Falsa 123", owner: storeOwner._id
        });

        product = await ProductModel.create({
            title: "Producto Test", description: "Desc", price: 50, stock: 10,
            category: "Test", store: store._id
        });

        order = await OrderModel.create({
            customer: customer._id,
            store: store._id,
            items: [{ product: product._id, quantity: 1, price: product.price }],
            deliveryAddress: "Calle Test 123",
            total: product.price,
            status: ORDER_STATUS.CREATED
        });
    });

    after(async () => {
        if (createdDeliveryId) {
            await DeliveryModel.findByIdAndDelete(createdDeliveryId);
        }
        await OrderModel.findByIdAndDelete(order._id);
        await ProductModel.findByIdAndDelete(product._id);
        await StoreModel.findByIdAndDelete(store._id);
        await UserModel.deleteMany({ _id: { $in: [admin._id, storeOwner._id, driver._id, outsider._id, customer._id] } });
    });

    describe("POST /api/deliveries", () => {
        it("Rechaza la creación sin token (401)", async () => {
            const response = await request.post("/api/deliveries").send({
                order: order._id,
                driver: driver._id
            });

            expect(response.status).to.equal(401);
        });

        it("Rechaza crear una entrega si no sos el dueño de la tienda de esa orden (403)", async () => {
            const response = await request
                .post("/api/deliveries")
                .set("Cookie", `accessToken=${outsiderToken}`)
                .send({
                    order: order._id,
                    driver: driver._id
                });

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("El dueño de la tienda crea la entrega y asigna un repartidor", async () => {
            const response = await request
                .post("/api/deliveries")
                .set("Cookie", `accessToken=${storeOwnerToken}`)
                .send({
                    order: order._id,
                    driver: driver._id
                });

            expect(response.status).to.equal(201);
            expect(response.body.payload).to.have.property("_id");
            expect(response.body.payload.status).to.equal("created");

            createdDeliveryId = response.body.payload._id;
        });
    });

    describe("GET /api/deliveries", () => {
        it("Rechaza el listado si no sos admin (403)", async () => {
            const response = await request
                .get("/api/deliveries")
                .set("Cookie", `accessToken=${storeOwnerToken}`);

            expect(response.status).to.equal(403);
        });

        it("Como admin, devuelve la lista de entregas", async () => {
            const response = await request
                .get("/api/deliveries")
                .set("Cookie", `accessToken=${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/deliveries/:did", () => {
        it("El repartidor asignado puede verla", async () => {
            const response = await request
                .get(`/api/deliveries/${createdDeliveryId}`)
                .set("Cookie", `accessToken=${driverToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdDeliveryId);
            expect(response.body.payload.driver).to.not.have.property("password");
        });

        it("El dueño de la tienda puede verla", async () => {
            const response = await request
                .get(`/api/deliveries/${createdDeliveryId}`)
                .set("Cookie", `accessToken=${storeOwnerToken}`);

            expect(response.status).to.equal(200);
        });

        it("Rechaza a un repartidor ajeno (403)", async () => {
            const response = await request
                .get(`/api/deliveries/${createdDeliveryId}`)
                .set("Cookie", `accessToken=${outsiderToken}`);

            expect(response.status).to.equal(403);
        });

        it("Devuelve 404 si la entrega no existe", async () => {
            const response = await request
                .get("/api/deliveries/000000000000000000000000")
                .set("Cookie", `accessToken=${adminToken}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("DELIVERY_NOT_FOUND");
        });
    });

    describe("PUT /api/deliveries/:did/status", () => {
        it("Rechaza la actualización si sos un repartidor ajeno (403)", async () => {
            const response = await request
                .put(`/api/deliveries/${createdDeliveryId}/status`)
                .set("Cookie", `accessToken=${outsiderToken}`)
                .send({ status: "assigned" });

            expect(response.status).to.equal(403);
        });

        it("El repartidor asignado actualiza el estado", async () => {
            const response = await request
                .put(`/api/deliveries/${createdDeliveryId}/status`)
                .set("Cookie", `accessToken=${driverToken}`)
                .send({ status: "assigned" });

            expect(response.status).to.equal(200);
            expect(response.body.payload.status).to.equal("assigned");
        });

        it("Rechaza si faltan datos requeridos (400)", async () => {
            const response = await request
                .put(`/api/deliveries/${createdDeliveryId}/status`)
                .set("Cookie", `accessToken=${driverToken}`)
                .send({});

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });
    });

    describe("DELETE /api/deliveries/:did", () => {
        it("Rechaza el borrado si no sos admin (403)", async () => {
            const response = await request
                .delete(`/api/deliveries/${createdDeliveryId}`)
                .set("Cookie", `accessToken=${storeOwnerToken}`);

            expect(response.status).to.equal(403);
        });

        it("Como admin, borra la entrega", async () => {
            const response = await request
                .delete(`/api/deliveries/${createdDeliveryId}`)
                .set("Cookie", `accessToken=${adminToken}`);

            expect(response.status).to.equal(200);

            createdDeliveryId = null;
        });
    });
});