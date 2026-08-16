import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import ProductModel from "../src/models/product.model.js";
import OrderModel from "../src/models/order.model.js";
import { generateToken } from "../src/utils/jwt.utils.js";
import { USER_ROLES } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Orders", () => {
    let admin, adminToken;
    let customer, customerToken;
    let storeOwner, storeOwnerToken;
    let outsider, outsiderToken;
    let store, product, createdOrderId;

    before(async () => {
        admin = await UserModel.create({
            firstName: "Admin", lastName: "Test",
            email: `admin.orders.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.ADMIN
        });
        adminToken = generateToken(admin);

        customer = await UserModel.create({
            firstName: "Cliente", lastName: "Test",
            email: `customer.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.CUSTOMER
        });
        customerToken = generateToken(customer);

        storeOwner = await UserModel.create({
            firstName: "Dueño", lastName: "Test",
            email: `owner.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.STORE
        });
        storeOwnerToken = generateToken(storeOwner);

        outsider = await UserModel.create({
            firstName: "Ajeno", lastName: "Test",
            email: `outsider.${Date.now()}@mail.com`,
            password: "clave123", role: USER_ROLES.CUSTOMER
        });
        outsiderToken = generateToken(outsider);

        store = await StoreModel.create({
            name: "Tienda Test",
            address: "Calle Falsa 123",
            owner: storeOwner._id
        });

        product = await ProductModel.create({
            title: "Producto Test",
            description: "Descripción de prueba",
            price: 100,
            stock: 5,
            category: "Test",
            store: store._id
        });
    });

    after(async () => {
        await OrderModel.deleteMany({ store: store._id });
        await ProductModel.findByIdAndDelete(product._id);
        await StoreModel.findByIdAndDelete(store._id);
        await UserModel.deleteMany({ _id: { $in: [admin._id, customer._id, storeOwner._id, outsider._id] } });
    });

    describe("POST /api/orders", () => {
        it("Rechaza la creación sin token (401)", async () => {
            const response = await request.post("/api/orders").send({
                customer: customer._id, store: store._id,
                deliveryAddress: "Av. Siempre Viva 742",
                items: [{ product: product._id, quantity: 1, price: 1 }]
            });

            expect(response.status).to.equal(401);
        });

        it("Rechaza crear un pedido a nombre de otro usuario (403)", async () => {
            const response = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({
                    customer: outsider._id,
                    store: store._id,
                    deliveryAddress: "Av. Siempre Viva 742",
                    items: [{ product: product._id, quantity: 1, price: 1 }]
                });

            expect(response.status).to.equal(403);
            expect(response.body.error).to.equal("FORBIDDEN");
        });

        it("Crea un pedido usando el precio real del producto, ignorando el precio del cliente", async () => {
            const response = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({
                    customer: customer._id,
                    store: store._id,
                    deliveryAddress: "Av. Siempre Viva 742",
                    items: [{ product: product._id, quantity: 2, price: 1 }]
                });

            expect(response.status).to.equal(201);
            expect(response.body.payload.items[0].price).to.equal(product.price);
            expect(response.body.payload.total).to.equal(product.price * 2);
            expect(response.body.payload.status).to.equal("created");

            createdOrderId = response.body.payload._id;
        });

        it("Descuenta el stock real del producto luego de crear el pedido", async () => {
            const updatedProduct = await ProductModel.findById(product._id);
            expect(updatedProduct.stock).to.equal(3);
        });

        it("Rechaza el pedido si faltan datos requeridos (400)", async () => {
            const response = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({ customer: customer._id });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });

        it("Rechaza el pedido si el producto no existe (404)", async () => {
            const response = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({
                    customer: customer._id, store: store._id,
                    deliveryAddress: "Av. Siempre Viva 742",
                    items: [{ product: "000000000000000000000000", quantity: 1, price: 10 }]
                });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });

        it("Rechaza el pedido si no hay stock suficiente (400)", async () => {
            const response = await request
                .post("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`)
                .send({
                    customer: customer._id, store: store._id,
                    deliveryAddress: "Av. Siempre Viva 742",
                    items: [{ product: product._id, quantity: 999, price: 10 }]
                });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ITEMS");
        });
    });

    describe("GET /api/orders", () => {
        it("Rechaza el listado si no sos admin (403)", async () => {
            const response = await request
                .get("/api/orders")
                .set("Authorization", `Bearer ${customerToken}`);

            expect(response.status).to.equal(403);
        });

        it("Como admin, devuelve la lista de pedidos", async () => {
            const response = await request
                .get("/api/orders")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/orders/:oid", () => {
        it("El customer dueño del pedido puede verlo", async () => {
            const response = await request
                .get(`/api/orders/${createdOrderId}`)
                .set("Authorization", `Bearer ${customerToken}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdOrderId);
            expect(response.body.payload.customer).to.not.have.property("password");
        });

        it("El dueño de la tienda puede verlo", async () => {
            const response = await request
                .get(`/api/orders/${createdOrderId}`)
                .set("Authorization", `Bearer ${storeOwnerToken}`);

            expect(response.status).to.equal(200);
        });

        it("Rechaza a un usuario ajeno al pedido (403)", async () => {
            const response = await request
                .get(`/api/orders/${createdOrderId}`)
                .set("Authorization", `Bearer ${outsiderToken}`);

            expect(response.status).to.equal(403);
        });

        it("Devuelve 404 si el pedido no existe", async () => {
            const response = await request
                .get("/api/orders/000000000000000000000000")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        });
    });

    describe("PUT /api/orders/:oid/status", () => {
        it("El customer no puede cambiar el estado (403)", async () => {
            const response = await request
                .put(`/api/orders/${createdOrderId}/status`)
                .set("Authorization", `Bearer ${customerToken}`)
                .send({ status: "assigned" });

            expect(response.status).to.equal(403);
        });

        it("El dueño de la tienda actualiza el estado a un valor válido", async () => {
            const response = await request
                .put(`/api/orders/${createdOrderId}/status`)
                .set("Authorization", `Bearer ${storeOwnerToken}`)
                .send({ status: "assigned" });

            expect(response.status).to.equal(200);
            expect(response.body.payload.status).to.equal("assigned");
        });

        it("Rechaza un estado inválido (400)", async () => {
            const response = await request
                .put(`/api/orders/${createdOrderId}/status`)
                .set("Authorization", `Bearer ${storeOwnerToken}`)
                .send({ status: "estado_inventado" });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_STATUS");
        });
    });
    describe("POST /api/orders/:oid/proof", () => {
        it("Rechaza la subida sin token (401)", async () => {
            const response = await request
                .post(`/api/orders/${createdOrderId}/proof`)
                .attach("proof", Buffer.from("contenido de prueba"), "comprobante.txt");

            expect(response.status).to.equal(401);
        });

        it("Rechaza la subida si no sos el dueño de la tienda ni admin (403)", async () => {
            const response = await request
                .post(`/api/orders/${createdOrderId}/proof`)
                .set("Authorization", `Bearer ${customerToken}`)
                .attach("proof", Buffer.from("contenido de prueba"), "comprobante.txt");

            expect(response.status).to.equal(403);
        });

        it("El dueño de la tienda sube el comprobante", async () => {
            const response = await request
                .post(`/api/orders/${createdOrderId}/proof`)
                .set("Authorization", `Bearer ${storeOwnerToken}`)
                .attach("proof", Buffer.from("contenido de prueba"), "comprobante.txt");

            expect(response.status).to.equal(200);
            expect(response.body.payload.proof).to.be.an("array").with.lengthOf(1);
            expect(response.body.payload.proof[0].type).to.equal("delivery_proof");
        });
    });
});