import { UserService } from "../services/users.service.js";
import { successResponse, createError } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAll();
    return successResponse(res, {
        message: "Usuarios obtenidos correctamente",
        payload: users,
    });
}
);

export const getUserById = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!uid) {
        throw createError("INVALID_INPUT", "ID de usuario no proporcionado");
    }
    const user = await UserService.getById(uid);
    return successResponse(res, {
        message: `Usuario ${uid} obtenido correctamente`,
        payload: user,
    });
});

export const createUser = asyncHandler(async (req, res) => {
    const userData = req.body;
    const user = await UserService.create(userData);
    return successResponse(res, {
        statusCode: 201,
        message: "Usuario creado correctamente",
        payload: user,
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const userData = req.body;
    if (!uid) {
        throw createError("INVALID_INPUT", "ID de usuario no proporcionado");
    }
    const user = await UserService.update(uid, userData);
    return successResponse(res, {
        message: `Usuario ${uid} actualizado correctamente`,
        payload: user,
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!uid) {
        throw createError("INVALID_INPUT", "ID de usuario no proporcionado");
    }
    const user = await UserService.delete(uid);
    return successResponse(res, {
        message: `Usuario ${uid} eliminado correctamente`,
        payload: user,
    });
});
