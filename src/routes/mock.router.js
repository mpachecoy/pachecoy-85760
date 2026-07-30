import { Router } from "express";
import {
    getMockUsers,
    getMockStores,
    getMockProducts,
    getMockOrders,
    getMockDeliveries,
    saveMockUsers
} from "../controllers/mock.controller.js";

const router = Router();

/**
 * @swagger
 * /api/mocks/users/{n}:
 *   get:
 *     summary: Obtiene n usuarios mock.
 *     description: Devuelve n usuarios mock.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de usuarios a obtener
 *     responses: 
 *       200:
 *         description: Lista de usuarios mock.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersResponse"
 */
router.get("/users/:n", getMockUsers);

/**
 * @swagger
 * /api/mocks/stores/{n}:
 *   get:
 *     summary: Obtiene n tiendas mock.
 *     description: Devuelve n tiendas mock.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de tiendas a obtener
 *     responses: 
 *       200:
 *         description: Lista de tiendas mock.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoresResponse"
 */
router.get("/stores/:n", getMockStores);

/**
 * @swagger
 * /api/mocks/products/{n}:
 *   get:
 *     summary: Obtiene n productos mock.
 *     description: Devuelve n productos mock.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de productos a obtener
 *     responses: 
 *       200:
 *         description: Lista de productos mock.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsResponse"
 */
router.get("/products/:n", getMockProducts);

/**
 * @swagger
 * /api/mocks/orders/{n}:
 *   get:
 *     summary: Obtiene n órdenes mock.
 *     description: Devuelve n órdenes mock.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de órdenes a obtener
 *     responses: 
 *       200:
 *         description: Lista de órdenes mock.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersResponse"
 */
router.get("/orders/:n", getMockOrders);

/**
 * @swagger
 * /api/mocks/deliveries/{n}:
 *   get:
 *     summary: Obtiene n entregas mock.
 *     description: Devuelve n entregas mock.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de entregas a obtener
 *     responses: 
 *       200:
 *         description: Lista de entregas mock.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveriesResponse"
 */
router.get("/deliveries/:n", getMockDeliveries);

/**
 * @swagger
 * /api/mocks/users/{n}:
 *   post:
 *     summary: Guarda n usuarios mock.
 *     description: Guarda n usuarios mock en la base de datos.
 *     tags:
 *       - Mock
 *     parameters: 
 *       - in: path
 *         name: n
 *         schema: 
 *           type: integer
 *         example: 10
 *         required: true
 *         description: Cantidad de usuarios a guardar
 *     responses: 
 *       200:
 *         description: Usuarios mock guardados.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersResponse"
 */
router.post("/users/:n", saveMockUsers);

export default router;
