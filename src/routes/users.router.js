import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = Router();

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Obtiene todos los usuarios.
 *     description: Devuelve todos los usuarios de la base de datos.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersResponse"
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtiene un usuario por ID.
 *     description: Devuelve un usuario por ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del usuario
 *     responses: 
 *       200:
 *         description: Usuario encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       404:
 *         description: Usuario no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersErrorResponse"
 */
router.get("/:uid", getUserById);

/**
 * @swagger
 * /api/users/:
 *   post:
 *     summary: Crea un nuevo usuario.
 *     description: Crea un nuevo usuario.
 *     tags:
 *       - Users
 *     requestBody: 
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/UserInput"
 *     responses: 
 *       200:
 *         description: Usuario creado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 */
router.post("/", createUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualiza un usuario.
 *     description: Actualiza un usuario por ID.
 *     tags:
 *       - Users
 *     parameters: 
 *       - in: path
 *         name: uid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json: 
 *           schema: 
 *             $ref: "#/components/schemas/UserInput"
 *     responses: 
 *       200:
 *         description: Usuario actualizado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       404:
 *         description: Usuario no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersErrorResponse"
 */
router.put("/:uid", updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Elimina un usuari   o.
 *     description: Elimina un usuario por ID.
 *     tags:
 *       - Users
 *     parameters: 
 *       - in: path
 *         name: uid
 *         schema: 
 *           type: string
 *         example: 6a4485be97eca2972879e510
 *         required: true
 *         description: ID del usuario
 *     responses: 
 *       200:
 *         description: Usuario eliminado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponse"
 *       404:
 *         description: Usuario no encontrado.
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersErrorResponse"
 */
router.delete("/:uid", deleteUser);

export default router;
