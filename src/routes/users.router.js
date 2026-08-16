import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, uploadUserDocuments } from "../controllers/users.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";
import { USER_ROLES } from "../constants/index.constants.js";
import upload from "../middlewares/upload.middleware.js";

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
router.get("/", authenticate, authorizeRole(USER_ROLES.ADMIN), getAllUsers);

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
router.get("/:uid", authenticate, getUserById);

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
router.post("/", authenticate, authorizeRole([USER_ROLES.ADMIN]), createUser);

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
router.put("/:uid", authenticate, updateUser);

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
router.delete("/:uid", authenticate, authorizeRole([USER_ROLES.ADMIN]), deleteUser);

// CARGA DE DOCUMENTOS
//Controla swagger
/**
 * @swagger
 * /api/users/{uid}/documents:
 *   post:
 *     summary: Sube un documento al perfil del usuario.
 *     description: Sube un documento al perfil del usuario.
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
 *         multipart/form-data: 
 *           schema: 
 *             type: object
 *             properties: 
 *               document: 
 *                 type: string
 *                 format: binary
 *                 description: Archivo del documento a subir
 *     responses: 
 *       200:
 *         description: Documento subido exitosamente.
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
router.post("/:uid/document", upload.single("document"), uploadUserDocuments);


export default router;
