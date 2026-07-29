import { Router } from "express";
import { getAllDeliveries, getDeliveryById, createDelivery, updateDelivery, deleteDelivery } from "../controllers/deliveries.controller.js";

const router = Router();

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtiene todas las entregas.
 *     description: Devuelve todas las entregas de la base de datos.
 *     tags:
 *       - Deliveries
 *     responses: 
 *       200:
 *         description: Lista de entregas.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveriesResponse"
 */
router.get("/", getAllDeliveries);

/**
 * @swagger
 * /api/deliveries/{did}:
 *   get:
 *     summary: Obtiene una entrega por ID.
 *     description: Devuelve una entrega por ID.
 *     tags:
 *       - Deliveries
 *     parameters: 
 *       - in: path
 *         name: did
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la entrega
 *     responses: 
 *       200:
 *         description: Entrega encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveryResponse"
 *       404:
 *         description: Entrega no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveriesErrorResponse"
 */
router.get("/:did", getDeliveryById);

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Crea una nueva entrega.
 *     description: Crea una nueva entrega.
 *     tags:
 *       - Deliveries
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/DeliveryInput"
 *     responses: 
 *       200:
 *         description: Entrega creada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveryResponse"
 */
router.post("/", createDelivery);

/**
 * @swagger
 * /api/deliveries/{did}/status:
 *   put:
 *     summary: Actualiza el estado de una entrega.
 *     description: Actualiza el estado de una entrega por ID.
 *     tags:
 *       - Deliveries
 *     parameters: 
 *       - in: path
 *         name: did
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la entrega
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/DeliveryInput"
 *     responses: 
 *       200:
 *         description: Entrega actualizada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveryResponse"
 *       404:
 *         description: Entrega no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveriesErrorResponse"
 */
router.put("/:did/status", updateDelivery);

/**
 * @swagger
 * /api/deliveries/{did}:
 *   delete:
 *     summary: Elimina una entrega.
 *     description: Elimina una entrega por ID.
 *     tags:
 *       - Deliveries
 *     parameters: 
 *       - in: path
 *         name: did
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la entrega
 *     responses: 
 *       200:
 *         description: Entrega eliminada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveryResponse"
 *       404:
 *         description: Entrega no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeliveriesErrorResponse"
 */
router.delete("/:did", deleteDelivery);

export default router;
