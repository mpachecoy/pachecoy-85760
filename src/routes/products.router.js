import { Router } from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const productsRouter = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos.
 *     description: Devuelve todos los productos de la base de datos.
 *     tags:
 *       - Products
 *     responses: 
 *       200:
 *         description: Lista de productos.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsResponse"
 */
productsRouter.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtiene un producto por ID.
 *     description: Devuelve un producto por ID.
 *     tags:
 *       - Products
 *     parameters: 
 *       - in: path
 *         name: pid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del producto
 *     responses: 
 *       200:
 *         description: Producto encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductResponse"
 *       404:
 *         description: Producto no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsErrorResponse"
 */
productsRouter.get("/:pid", getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crea un nuevo producto.
 *     description: Crea un nuevo producto.
 *     tags:
 *       - Products
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/ProductInput"
 *     responses: 
 *       200:
 *         description: Producto creado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductResponse"
 */
productsRouter.post("/", authenticate, createProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualiza un producto por ID.
 *     description: Actualiza un producto por ID.
 *     tags:
 *       - Products
 *     parameters: 
 *       - in: path
 *         name: pid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del producto
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/ProductInput"
 *     responses: 
 *       200:
 *         description: Producto actualizado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductResponse"
 *       404:
 *         description: Producto no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsErrorResponse"
 */
productsRouter.put("/:pid", authenticate, updateProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Elimina un producto por ID.
 *     description: Elimina un producto por ID.
 *     tags:
 *       - Products
 *     parameters: 
 *       - in: path
 *         name: pid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del producto
 *     responses: 
 *       200:
 *         description: Producto eliminado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductResponse"
 *       404:
 *         description: Producto no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ProductsErrorResponse"
 */
productsRouter.delete("/:pid", authenticate, deleteProduct);

export default productsRouter;
