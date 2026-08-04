import { describe, it, before, after } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import UserModel from "../src/models/user.model.js";
import StoreModel from "../src/models/store.model.js";
import ProductModel from "../src/models/product.model.js";
import OrderModel from "../src/models/order.model.js";
import { USER_ROLES } from "../src/constants/index.constants.js";

const request = supertest(app);

describe("Test FUNCIONAL - Módulo Orders", () => {
    let customer, storeOwner, store, product, createdOrderId;

    before(async () => {
        customer = await UserModel.create({
            firstName: "Cliente",
            lastName: "Test",
            email: `customer.${Date.now()}@mail.com`,
            password: "clave123",
            role: USER_ROLES.CUSTOMER
        });

        storeOwner = await UserModel.create({
            firstName: "Dueño",
            lastName: "Test",
            email: `owner.${Date.now()}@mail.com`,
            password: "clave123",
            role: USER_ROLES.STORE
        });

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
            category: "Test"
        });

        console.log("--- INICIO TEST FUNCIONAL ORDERS ---");
    });

    after(async () => {
        await OrderModel.deleteMany({ store: store._id });
        await ProductModel.findByIdAndDelete(product._id);
        await StoreModel.findByIdAndDelete(store._id);
        await UserModel.deleteMany({ _id: { $in: [customer._id, storeOwner._id] } });

        console.log("--- FIN TEST FUNCIONAL ORDERS ---");
    });

    describe("POST /api/orders", () => {
        it("Crea un pedido usando el precio real del producto, ignorando el precio del cliente", async () => {
            const response = await request.post("/api/orders").send({
                customer: customer._id,
                store: store._id,
                deliveryAddress: "Av. Siempre Viva 742",
                items: [
                    { product: product._id, quantity: 2, price: 1 }
                ]
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
            const response = await request.post("/api/orders").send({
                customer: customer._id
            });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("MISSING_REQUIRED_DATA");
        });

        it("Rechaza el pedido si el producto no existe (404)", async () => {
            const response = await request.post("/api/orders").send({
                customer: customer._id,
                store: store._id,
                deliveryAddress: "Av. Siempre Viva 742",
                items: [{ product: "000000000000000000000000", quantity: 1, price: 10 }]
            });

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("PRODUCT_NOT_FOUND");
        });

        it("Rechaza el pedido si no hay stock suficiente (400)", async () => {
            const response = await request.post("/api/orders").send({
                customer: customer._id,
                store: store._id,
                deliveryAddress: "Av. Siempre Viva 742",
                items: [{ product: product._id, quantity: 999, price: 10 }]
            });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_ITEMS");
        });
    });

    describe("GET /api/orders", () => {
        it("Devuelve la lista de pedidos", async () => {
            const response = await request.get("/api/orders");

            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an("array");
        });
    });

    describe("GET /api/orders/:oid", () => {
        it("Devuelve el pedido creado por su ID", async () => {
            const response = await request.get(`/api/orders/${createdOrderId}`);

            expect(response.status).to.equal(200);
            expect(response.body.payload._id).to.equal(createdOrderId);
        });

        it("Devuelve 404 si el pedido no existe", async () => {
            const response = await request.get("/api/orders/000000000000000000000000");

            expect(response.status).to.equal(404);
            expect(response.body.error).to.equal("ORDER_NOT_FOUND");
        });
    });

    describe("PUT /api/orders/:oid/status", () => {
        it("Actualiza el estado del pedido a un valor válido", async () => {
            const response = await request.put(`/api/orders/${createdOrderId}/status`).send({
                status: "assigned"
            });

            expect(response.status).to.equal(200);
            expect(response.body.payload.status).to.equal("assigned");
        });

        it("Rechaza un estado inválido (400)", async () => {
            const response = await request.put(`/api/orders/${createdOrderId}/status`).send({
                status: "estado_inventado"
            });

            expect(response.status).to.equal(400);
            expect(response.body.error).to.equal("INVALID_STATUS");
        });
    });
});