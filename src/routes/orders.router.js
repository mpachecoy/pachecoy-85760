import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orders.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { USER_ROLES } from "../constants/index.constants.js";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtiene todas las órdenes.
 *     description: Devuelve todas las órdenes de la base de datos.
 *     tags:
 *       - Orders
 *     responses: 
 *       200:
 *         description: Lista de órdenes.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersResponse"
 */
router.get("/", authenticate, authorizeRole([USER_ROLES.ADMIN]), getAllOrders);

/**
 * @swagger
 * /api/orders/{oid}:
 *   get:
 *     summary: Obtiene una orden por ID.
 *     description: Devuelve una orden por ID.
 *     tags:
 *       - Orders
 *     parameters: 
 *       - in: path
 *         name: oid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la orden
 *     responses: 
 *       200:
 *         description: Orden encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 *       404:
 *         description: Orden no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersErrorResponse"
 */
router.get("/:oid", authenticate, getOrderById);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crea una nueva orden.
 *     description: Crea una nueva orden.
 *     tags:
 *       - Orders
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/OrderInput"
 *     responses: 
 *       200:
 *         description: Orden creada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 */
router.post("/", authenticate, createOrder);

/**
 * @swagger
 * /api/orders/{oid}/status:
 *   put:
 *     summary: Actualiza el estado de una orden.
 *     description: Actualiza el estado de una orden por ID.
 *     tags:
 *       - Orders
 *     parameters: 
 *       - in: path
 *         name: oid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la orden
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/OrderInput"
 *     responses: 
 *       200:
 *         description: Orden actualizada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 *       404:
 *         description: Orden no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersErrorResponse"
 */
router.put("/:oid/status", authenticate, updateOrder);

/**
 * @swagger
 * /api/orders/{oid}:
 *   delete:
 *     summary: Elimina una orden.
 *     description: Elimina una orden por ID.
 *     tags:
 *       - Orders
 *     parameters: 
 *       - in: path
 *         name: oid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la orden
 *     responses: 
 *       200:
 *         description: Orden eliminada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrderResponse"
 *       404:
 *         description: Orden no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/OrdersErrorResponse"
 */
router.delete("/:oid", authenticate, authorizeRole([USER_ROLES.ADMIN]), deleteOrder);


export default router;
