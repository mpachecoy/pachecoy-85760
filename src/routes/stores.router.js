import { Router } from "express";
import { getAllStores, getStoreById, createStore, updateStore, deleteStore } from "../controllers/store.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();


/**
 * @swagger
 * /api/stores:
 *   get:
 *     summary: Obtiene todas las tiendas.
 *     description: Devuelve todas las tiendas.
 *     tags:
 *       - Stores
 *     responses: 
 *       200:
 *         description: Lista de tiendas.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoresResponse"
 */
router.get("/", getAllStores);

/**
 * @swagger
 * /api/stores/{sid}:
 *   get:
 *     summary: Obtiene una tienda por ID.
 *     description: Devuelve una tienda por ID.
 *     tags:
 *       - Stores
 *     parameters: 
 *       - in: path
 *         name: sid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la tienda
 *     responses: 
 *       200:
 *         description: Tienda encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoreResponse"
 *       404:
 *         description: Tienda no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoresErrorResponse"
 */
router.get("/:sid", getStoreById);

/**
 * @swagger
 * /api/stores:
 *   post:
 *     summary: Crea una nueva tienda.
 *     description: Crea una nueva tienda.
 *     tags:
 *       - Stores
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/StoreInput"
 *     responses: 
 *       200:
 *         description: Tienda creada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoreResponse"
 */
router.post("/", authenticate, createStore);

/**
 * @swagger
 * /api/stores/{sid}:
 *   put:
 *     summary: Actualiza una tienda por ID.
 *     description: Actualiza una tienda por ID.
 *     tags:
 *       - Stores
 *     parameters: 
 *       - in: path
 *         name: sid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la tienda
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/StoreInput"
 *     responses: 
 *       200:
 *         description: Tienda actualizada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoreResponse"
 *       404:
 *         description: Tienda no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoresErrorResponse"
 */
router.put("/:sid", authenticate, updateStore);

/**
 * @swagger
 * /api/stores/{sid}:
 *   delete:
 *     summary: Elimina una tienda por ID.
 *     description: Elimina una tienda por ID.
 *     tags:
 *       - Stores
 *     parameters: 
 *       - in: path
 *         name: sid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID de la tienda
 *     responses: 
 *       200:
 *         description: Tienda eliminada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoreResponse"
 *       404:
 *         description: Tienda no encontrada.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/StoresErrorResponse"
 */
router.delete("/:sid", authenticate, deleteStore);

export default router;
